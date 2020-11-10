import * as React from "react";
import styled from "styled-components";
import WifiIcon from "../../../ui/icons/wifi";
import SocialDistancingIcon from "../../../ui/icons/social-distancing";
import UserSpeakBubble from "../../../ui/icons/user-speak-bubble";
import CheckMarkCircle from "../../../ui/icons/check-mark-circle";
import LineGraph from "../../../ui/icons/line-graph";
import Tip from "./tip";
import TipsSpeak from "./tips-speak";
import TipsVerify from "./tips-verify";

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

interface Props {
    onSkip: () => void;
    contributeType: string;
}

interface State {}

export default class Tips extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        const { onSkip, contributeType } = this.props;
        const isSpeak = contributeType == "tala";
        return (
            <TipsContainer>
                {isSpeak ? <TipsSpeak /> : <TipsVerify />}
                <SkipButton onClick={onSkip}>Áfram</SkipButton>
            </TipsContainer>
        );
    }
}
