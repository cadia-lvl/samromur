import * as React from 'react';
import styled from 'styled-components';
import TipsSpeak from './tips-speak';
import TipsVerify from './tips-verify';
import Checkbox from '../../../ui/input/checkbox';
import { connect } from 'react-redux';
import { setSkipTips } from '../../../../store/user/actions';

const TipsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    ${({ theme }) => theme.media.smallUp} {
        max-width: 40rem;
    }
`;

const SkipButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 0.1rem;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.colors.green};
    color: white;

    cursor: pointer;
    & :active {
        transform: translateY(2px);
    }

    & span {
        font-size: 0.8rem;
    }
    width: 100%;
    max-width: 25rem;
    margin: 0 auto;

    ${({ theme }) => theme.media.small} {
        max-width: 100%;
    }
`;

const SkipInFutureContainer = styled.div`
    display: grid;
    grid-template-columns: 10% auto;
    justify-items: flex-start;
    align-items: center;
    & span {
        margin-left: 1rem;
    }

    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;
    }
`;

const dispatchProps = {
    setSkipTips,
};

interface Props {
    onSkip: () => void;
    contributeType: string;
}

interface State {
    checked: boolean;
}

type TipsProps = Props & typeof dispatchProps;

class Tips extends React.Component<TipsProps, State> {
    constructor(props: TipsProps) {
        super(props);
        this.state = {
            checked: false,
        };
    }

    handleSkipInFuture = () => {
        this.setState({ checked: !this.state.checked });
    };

    handleContinue = () => {
        const { checked } = this.state;
        this.props.setSkipTips(checked);
        this.props.onSkip();
    };

    render() {
        const { contributeType } = this.props;
        const { checked } = this.state;
        const isSpeak = contributeType == 'tala';
        return (
            <TipsContainer>
                {isSpeak ? <TipsSpeak /> : <TipsVerify />}
                <SkipInFutureContainer>
                    <Checkbox
                        checked={checked}
                        onChange={this.handleSkipInFuture}
                    />
                    <span>Sleppa þessum glugga næst</span>
                </SkipInFutureContainer>
                <SkipButton onClick={this.handleContinue}>Áfram</SkipButton>
            </TipsContainer>
        );
    }
}

export default connect(null, dispatchProps)(Tips);
