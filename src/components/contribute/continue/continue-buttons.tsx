import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { pages } from '../../../constants/paths';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import {
    resetContribute,
    setGoal,
    setExpanded,
    setGaming,
} from '../../../store/contribute/actions';
import { listenGoals, speakGoals } from '../../../constants/packages';
import { Goal } from '../../../types/contribute';

const ContinueButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const SlidingButtons = styled.div`
    position: relative;
`;

interface ButtonsContainerProps {
    position: number;
}

const ButtonsContainer = styled.div<ButtonsContainerProps>`
    position: absolute;
    transform: ${({ position }) =>
            `translateX(${
                position == 0 ? '0%' : position > 0 ? '25%' : '-25%'
            })`}
        scale(${({ position }) => (position == 0 ? 1 : 0)});
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        scale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 1rem;
    & > div {
        margin: 0 0.5rem;
    }
`;

interface ButtonProps {
    color: string;
}

const ButtonContainer = styled.div<ButtonProps>`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    background-color: ${({ theme, color }) => theme.colors[color]};
    color: white;
    cursor: pointer;
    ${({ color }) => color == 'green' && `flex: 1;`}
    max-width: 20rem;
    & :active {
        transform: translateY(2px);
    }
    & span {
        font-size: 0.8rem;
    }
`;

const MessageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
interface FadingMessageProps {
    visible: boolean;
}

const dispatchProps = {
    resetContribute,
    setExpanded,
    setGoal,
    setGaming,
};

interface ContinueButtonsProps {
    onContinue: () => void;
}

type Props = ReturnType<typeof mapStateToProps> &
    ContinueButtonsProps &
    WithRouterProps &
    typeof dispatchProps;

interface State {
    shouldContinue: boolean;
}

class ContinueButtons extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            shouldContinue: false,
        };
    }

    handleContinue = () => {
        const {
            contribute: { expanded },
        } = this.props;
        if (!expanded) {
            return;
        }
        this.setState({ shouldContinue: !this.state.shouldContinue });
    };

    handleGoal = (goal: Goal) => {
        const {
            contribute: { expanded },
        } = this.props;
        if (!expanded) {
            return;
        }
        this.setState({ shouldContinue: false });

        const {
            onContinue,
            setExpanded,
            setGoal,
            resetContribute,
        } = this.props;
        resetContribute();
        setGoal(goal);
        onContinue();
        setExpanded(false);
    };

    /**
     * Switches the context (from speak to listen or vice verse.)
     * and re-routes the user to the contribution amount selection.
     */
    handleSwitch = () => {
        const {
            contribute: { expanded },
            setGaming,
            resetContribute,
        } = this.props;
        if (!expanded) {
            return;
        }
        const {
            contribute: { goal },
            router,
        } = this.props;
        setGaming(false);
        resetContribute();
        if (goal && goal.contributeType == 'hlusta') {
            router.push(pages.speak);
        } else {
            router.push(pages.listen);
        }
    };

    render() {
        const { shouldContinue } = this.state;
        const {
            contribute: { goal },
        } = this.props;
        const goals =
            goal && goal.contributeType == 'tala' ? speakGoals : listenGoals;
        return (
            <ContinueButtonsContainer>
                <MessageContainer>
                    <span>
                        {shouldContinue
                            ? 'Hversu lengi viltu halda áfram'
                            : 'Viltu halda áfram?'}
                    </span>
                </MessageContainer>
                <SlidingButtons>
                    <ButtonsContainer position={shouldContinue ? -1 : 0}>
                        <ButtonContainer
                            color={'blue'}
                            onClick={this.handleSwitch}
                        >
                            <>
                                {goal && goal.contributeType == 'hlusta'
                                    ? 'Lesa inn'
                                    : 'Yfirfara'}
                            </>
                        </ButtonContainer>
                        <ButtonContainer
                            color={'green'}
                            onClick={this.handleContinue}
                        >
                            <>Halda áfram</>
                        </ButtonContainer>
                    </ButtonsContainer>
                    <ButtonsContainer position={shouldContinue ? 0 : 1}>
                        <ButtonContainer
                            color={'blue'}
                            onClick={() => this.handleGoal(goals[0])}
                        >
                            <>{goals[0].name}</>
                            <span>{goals[0].text}</span>
                        </ButtonContainer>
                        <ButtonContainer
                            color={'blue'}
                            onClick={() => this.handleGoal(goals[1])}
                        >
                            <>{goals[1].name}</>
                            <span>{goals[1].text}</span>
                        </ButtonContainer>
                        <ButtonContainer
                            color={'green'}
                            onClick={() => this.handleGoal(goals[2])}
                        >
                            <>{goals[2].name}</>
                            <span>{goals[2].text}</span>
                        </ButtonContainer>
                    </ButtonsContainer>
                </SlidingButtons>
            </ContinueButtonsContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withRouter(ContinueButtons));
