import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { pages } from '../../../constants/paths';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";
import ContinueButtons from './continue-buttons';
import ContinueChart from '../../charts/continue-chart';


const FakeHUDContainer = styled.div`

`;

interface ContinueContainerProps {
    expanded: boolean;
}

const ContinueModalContainer = styled.div<ContinueContainerProps>`
    position: relative;
    display: grid;
    grid-template-rows: ${({ theme }) => theme.layout.hudHeight} 5rem 40% auto auto;
    width: 100%;
    height: 100%;
    max-height: 55rem;
    padding: 1rem;
    padding-top: 2rem;
    margin: 0 auto;
    background-color: white;
    
    & > * {
        pointer-events: ${({ expanded }) => expanded ? 'auto' : 'none'};
        margin: 0 auto;
        width: 100%;
        max-width: 60rem;
    }
`;

const ChartContainer = styled.div`
    width: 100%;
    max-width: 45rem;
    height: 15rem;
    padding: 0 1rem;
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

const dispatchProps = {

}

interface ContinueModalProps {
    expanded: boolean;
    onContinue: () => void;
}

type Props = ReturnType<typeof mapStateToProps> & ContinueModalProps & WithRouterProps & typeof dispatchProps;

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
        }
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
    }


    render() {
        const {
            contribute: { goal },
            stats: { weekly },
            expanded,
            onContinue,
        } = this.props;
        const {
            clipsToday,
            shouldDraw
        } = this.state;

        const progressToday =
            goal?.contributeType == 'tala' ?
                weekly.clips[weekly.clips.length - 1].count :
                goal?.contributeType == 'hlusta' ?
                    weekly.votes[weekly.votes.length - 1].count :
                    0;
        return (
            <ContinueModalContainer expanded={expanded}>
                <FakeHUDContainer />
                <Title>
                    Takk fyrir að gefa í Samróm!
                </Title>
                <ChartContainer>
                    {shouldDraw && <ContinueChart count={goal?.count || 0} />}
                </ChartContainer>
                <StatsMessageContainer>
                    <StatsMessage>
                        Árangur dagsins eru <span>{progressToday + (goal?.count || 0)}</span> setningar.
                    </StatsMessage>
                </StatsMessageContainer>
                <ContinueButtons
                    onContinue={onContinue}
                />
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
)(withRouter(ContinueModal));