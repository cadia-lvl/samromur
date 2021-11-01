import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { pages } from '../../../constants/paths';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import ContinueButtons from './continue-buttons';
import ContinueChart from '../../charts/continue-chart';
import { ContributeType } from '../../../types/contribute';
import { withTranslation, WithTranslation } from '../../../server/i18n';
import { Trans } from 'react-i18next';
import * as colors from '../../competition/ui/colors';

const FakeHUDContainer = styled.div``;

interface ContinueContainerProps {
    expanded: boolean;
}

const ContinueModalContainer = styled.div<ContinueContainerProps>`
    position: relative;
    display: grid;
    grid-template-rows: ${({ theme }) => theme.layout.hudHeight} 5rem 40% auto auto;
    width: 100%;
    height: ${({ expanded }) => (expanded ? '100vh' : '0px')};
    max-height: 55rem;
    padding: 1rem;
    padding-top: 2rem;
    margin: 0 auto;
    background-color: white;

    & > * {
        pointer-events: ${({ expanded }) => (expanded ? 'auto' : 'none')};
        margin: 0 auto;
        width: 85%;
        max-width: 62.5hm;
    }
`;

const ChartContainer = styled.div`
    max-width: 45rem;
    height: 15rem;
    padding-top: 1rem;
`;

const Title = styled.h2`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StatsMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StatsMessage = styled.div`
    text-align: center;
    font-size: 1.1rem;

    & span {
        font-size: 1.2rem;
        font-weight: 600;
    }
`;

const StyledLink = styled.a`
    color: ${colors.siminn};

    :visited {
        text-decoration: none;
        color: ${colors.siminn};
    }

    :focus,
    :hover {
        text-decoration: none;
        color: ${colors.purple1};
    }
`;

const dispatchProps = {};

interface ContinueModalProps {
    expanded: boolean;
    onContinue: () => void;
}

type Props = ReturnType<typeof mapStateToProps> &
    ContinueModalProps &
    WithRouterProps &
    WithTranslation &
    typeof dispatchProps;

interface State {
    clipsToday: number;
    shouldDraw: boolean;
}

class ContinueModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            clipsToday: 0,
            shouldDraw: true,
        };
    }

    componentDidUpdate = (prevProps: Props) => {
        const { expanded } = this.props;
        if (!expanded && prevProps.expanded) {
            this.setState({
                shouldDraw: false,
            });
        }
        if (expanded && !prevProps.expanded) {
            setTimeout(() => this.setState({ shouldDraw: true }), 500);
        }
    };

    getProgressToday = (): number => {
        const totalToday = this.getIndividualTodayCount();
        const weeklyToday = this.getWeeklyToday();
        return totalToday + weeklyToday;
    };

    getIndividualTodayCount = (): number => {
        const {
            contribute: { goal, totalSpoken, totalRepeated, totalVerified },
        } = this.props;
        const contributeType = goal?.contributeType;

        switch (contributeType) {
            case ContributeType.SPEAK:
                return totalSpoken;
            case ContributeType.REPEAT:
                return totalRepeated;
            case ContributeType.LISTEN:
                return totalVerified;
            default:
                return 0;
        }
    };

    getWeeklyToday = (): number => {
        const {
            contribute: { goal },
            stats: { weekly },
        } = this.props;
        const contributeType = goal?.contributeType;

        switch (contributeType) {
            case ContributeType.SPEAK:
                return weekly.clips[weekly.clips.length - 1]?.count;
            case ContributeType.REPEAT:
                return weekly.repeatClips[weekly.repeatClips.length - 1]?.count;
            case ContributeType.LISTEN:
                return weekly.votes[weekly.votes.length - 1]?.count;
            default:
                return 0;
        }
    };

    render() {
        const {
            contribute: { goal },
            stats: { weekly },
            expanded,
            onContinue,
        } = this.props;
        const { shouldDraw } = this.state;

        const progressToday = this.getProgressToday();
        const individualCount = this.getIndividualTodayCount();

        const { t } = this.props;

        return (
            <ContinueModalContainer expanded={expanded}>
                <FakeHUDContainer />
                <Title>Takk fyrir að redda málinu!</Title>
                <ChartContainer>
                    {shouldDraw && (
                        <ContinueChart
                            contributeType={goal?.contributeType || ''}
                            count={individualCount || 0}
                        />
                    )}
                </ChartContainer>
                <StatsMessageContainer>
                    <StatsMessage>
                        <Trans i18nKey="todays-contributions" t={t}>
                            Árangur dagsins eru <span>{{ progressToday }}</span>{' '}
                            setningar.
                        </Trans>
                    </StatsMessage>
                </StatsMessageContainer>
                <ContinueButtons onContinue={onContinue} />
                <StatsMessageContainer>
                    <StatsMessage>
                        <StyledLink href={'/keppni'}>
                            Takk fyrir mig, taktu mig á Stigatöfluna
                        </StyledLink>
                    </StatsMessage>
                </StatsMessageContainer>
            </ContinueModalContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    stats: state.stats,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withRouter(withTranslation('wheel')(ContinueModal)));
