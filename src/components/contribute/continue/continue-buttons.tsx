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
import {
    listenGoals,
    speakGoals,
    repeatGoals,
} from '../../../constants/packages';
import { ContributeType, Goal } from '../../../types/contribute';
import takathatt from '../../../pages/takathatt';
import contribute from '../setup/contribute';
import { capitalizeFirstLetter } from '../../../utilities/string-helper';

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
    handleSwitch = async (switchTo: string) => {
        const {
            contribute: { expanded },
            setGaming,
            resetContribute,
        } = this.props;
        if (!expanded) {
            return;
        }
        const { router } = this.props;
        console.log(`switch to: ${switchTo}`);
        switch (switchTo.toLowerCase()) {
            case ContributeType.SPEAK:
                console.log(`switching to: speak`);
                await router.push(pages.speak);
                break;
            case ContributeType.LISTEN:
                console.log(`switching to: listen`);
                await router.push(pages.listen);
                break;
            case ContributeType.REPEAT:
                console.log(`switching to: repeat`);
                await router.push(pages.repeat);
                break;
        }
        setGaming(false);
        resetContribute();
    };

    getGoals = (): Goal[] => {
        const {
            contribute: { goal },
        } = this.props;

        switch (goal?.contributeType) {
            case ContributeType.SPEAK:
                return speakGoals;
            case ContributeType.LISTEN:
                return listenGoals;
            case ContributeType.REPEAT:
                return repeatGoals;
            default:
                // if nothing found, assume speak goals
                return speakGoals;
        }
    };

    getButtonsText = (): string[] => {
        const {
            contribute: { goal },
        } = this.props;
        const tala = capitalizeFirstLetter(ContributeType.SPEAK);
        const hlusta = capitalizeFirstLetter(ContributeType.LISTEN);
        const herma = capitalizeFirstLetter(ContributeType.REPEAT);
        switch (goal!.contributeType) {
            case ContributeType.SPEAK:
                return [hlusta, herma, `${tala} meira`];
            case ContributeType.LISTEN:
                return [tala, herma, `${hlusta} meira`];
            case ContributeType.REPEAT:
                return [tala, hlusta, `${herma} meira`];
            default:
                return ['', '', ''];
        }
    };

    render() {
        const { shouldContinue } = this.state;
        const goals = this.getGoals();
        const buttons = this.getButtonsText();
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
                            onClick={() => this.handleSwitch(buttons[0])}
                        >
                            <>{buttons[0]}</>
                        </ButtonContainer>
                        <ButtonContainer
                            color={'blue'}
                            onClick={() => this.handleSwitch(buttons[1])}
                        >
                            <>{buttons[1]}</>
                        </ButtonContainer>
                        <ButtonContainer
                            color={'green'}
                            onClick={this.handleContinue}
                        >
                            <>{buttons[2]}</>
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
