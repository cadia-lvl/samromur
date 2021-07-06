import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { pages } from '../../../constants/paths';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';
import WarningModal from './warning-modal';

import { resetContribute, setGaming } from '../../../store/contribute/actions';

import BackArrowIcon from '../../ui/icons/back-arrow';
import { WithTranslation, withTranslation } from '../../../server/i18n';

const HUDContainer = styled.div`
    position: absolute;
    width: 100%;
    padding: 0 1rem;
    max-width: ${({ theme }) => theme.layout.gameWidth};
    height: ${({ theme }) => theme.layout.hudHeight};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 10;
`;

const BackButton = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    & :active {
        transform: translateY(1px);
    }
`;

const ProgressContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: grey;
`;

const TextBar = styled.div`
    width: 100%;
    padding-left: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 1.1rem;
    font-weight: 600;
    color: grey;
    white-space: nowrap;
`;

const Title = styled.div``;

interface HUDProps {}

interface State {
    showWarningModal: boolean;
}

const dispatchProps = {
    resetContribute,
    setGaming,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    HUDProps &
    WithTranslation &
    WithRouterProps;

class HeadsUpDisplay extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showWarningModal: false,
        };
    }

    handleBack = () => {
        const {
            contribute: { goal, progress },
            resetContribute,
            router,
            setGaming,
        } = this.props;
        const path = this.whereTo(true);
        if (
            progress > 0 &&
            goal &&
            progress != goal.count &&
            path !== pages.frontPage &&
            !this.state.showWarningModal
        ) {
            this.setState(() => ({
                showWarningModal: true,
            }));
            return;
        }
        if (path == pages.contribute && goal) {
            setGaming(false);
            resetContribute();
        } else {
            router.push(path);
        }
    };

    whereTo = (path?: boolean): string => {
        const {
            contribute: { expanded, goal, progress },
            router: { pathname },
            t,
        } = this.props;
        if (expanded) {
            return path ? pages.frontPage : t('back-to-homepage');
        }
        switch (pathname) {
            case '/tala':
            case '/herma':
                return path
                    ? pages.contribute
                    : goal
                    ? t('choose-amount')
                    : t('common:take-part');
            case '/hlusta':
                return path
                    ? pages.contribute
                    : goal
                    ? t('choose-amount')
                    : t('common:take-part');
            default:
                return path ? pages.frontPage : t('common:homepage');
        }
    };

    handleStayOnPage = () => {
        this.setState(() => ({
            showWarningModal: false,
        }));
    };

    handleLeavePage = () => {
        this.handleBack();
        this.handleStayOnPage();
    };

    render() {
        const {
            contribute: { gaming, goal, progress },
            router,
        } = this.props;
        return (
            <HUDContainer>
                <BackButton onClick={this.handleBack}>
                    <BackArrowIcon height={18} width={18} fill={'grey'} />
                </BackButton>
                <WarningModal
                    isOpen={this.state.showWarningModal}
                    onExit={this.handleLeavePage}
                    onStay={this.handleStayOnPage}
                />
                <TextBar>
                    <Title>
                        <span>{this.whereTo()}</span>
                    </Title>
                    {gaming && goal && (
                        <ProgressContainer>
                            {/* <span>{goal.name}:</span> */}
                            <span>
                                {progress} / {goal.count}
                            </span>
                        </ProgressContainer>
                    )}
                </TextBar>
            </HUDContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withRouter(withTranslation(['contribute', 'common'])(HeadsUpDisplay)));
