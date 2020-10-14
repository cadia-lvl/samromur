import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { pages } from '../../../constants/paths';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";
import {
    resetContribute,
    setGoal,
    setExpanded,
} from '../../../store/contribute/actions';
import { speakGoals } from '../../../constants/packages';
import { Goal } from '../../../types/contribute';

import OpacitySwap from '../../ui/animated/opacity';

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
    transform:
        ${({ position }) => `translateX(${position == 0 ? '0%' : position > 0 ? '25%' : '-25%'})`}
        scale(${({ position }) => position == 0 ? 1 : 0});
    transition:
        transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        scale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 1rem;
    gap: 1rem;
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

const MessageContainer = styled(OpacitySwap)`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
interface FadingMessageProps {
    visible: boolean;
}

const dispatchProps = {
    resetContribute,
    setExpanded,
    setGoal,
}

interface ContinueButtonsProps {
    onContinue: () => void;
}

type Props = ReturnType<typeof mapStateToProps> & ContinueButtonsProps & WithRouterProps & typeof dispatchProps;

interface State {
    shouldContinue: boolean;
}

class ContinueButtons extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            shouldContinue: false
        }
    }

    handleContinue = () => {
        const { contribute: { expanded } } = this.props;
        if (!expanded) {
            return;
        }
        this.setState({ shouldContinue: !this.state.shouldContinue });
    }

    handleGoal = (goal: Goal) => {
        const { contribute: { expanded } } = this.props;
        if (!expanded) {
            return;
        }
        this.setState({ shouldContinue: false });

        const { onContinue, setExpanded, setGoal, resetContribute } = this.props;
        resetContribute();
        setGoal(goal);
        setExpanded(false);
        setTimeout(() => onContinue(), 1);
    }

    handleSwitch = () => {
        const { contribute: { expanded } } = this.props;
        if (!expanded) {
            return;
        }
        const {
            contribute: { goal },
            router,
        } = this.props;
        if (goal && goal.contributeType == 'hlusta') {
            router.push(pages.speak);
        } else {
            router.push(pages.listen);
        }
    }

    render() {
        const { shouldContinue } = this.state;
        const { contribute: { goal } } = this.props;
        return (
            <ContinueButtonsContainer>
                <MessageContainer second={shouldContinue}>
                    <span>Viltu halda áfram?</span>
                    <span>Hversu lengi viltu halda áfram?</span>
                </MessageContainer>
                <SlidingButtons>
                    <ButtonsContainer position={shouldContinue ? -1 : 0}>
                        <ButtonContainer color={'blue'} onClick={this.handleSwitch}>
                            <>{goal && goal.contributeType == 'hlusta' ? 'Lesa inn' : 'Yfirfara'}</>
                        </ButtonContainer>
                        <ButtonContainer color={'green'} onClick={this.handleContinue}>
                            <>Halda áfram</>
                        </ButtonContainer>
                    </ButtonsContainer>
                    <ButtonsContainer position={shouldContinue ? 0 : 1}>
                        <ButtonContainer color={'blue'} onClick={() => this.handleGoal(speakGoals[0])}>
                            <>Lítið</>
                            <span>10 setningar</span>
                        </ButtonContainer>
                        <ButtonContainer color={'blue'} onClick={() => this.handleGoal(speakGoals[1])}>
                            <>Miðlungs</>
                            <span>20 setningar</span>
                        </ButtonContainer>
                        <ButtonContainer color={'green'} onClick={() => this.handleGoal(speakGoals[2])}>
                            <>Mikið</>
                            <span>50 setningar</span>
                        </ButtonContainer>
                    </ButtonsContainer>
                </SlidingButtons>
            </ContinueButtonsContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withRouter(ContinueButtons));