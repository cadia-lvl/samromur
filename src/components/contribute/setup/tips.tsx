import * as React from 'react';
import styled from 'styled-components';
import WifiIcon from '../../ui/icons/wifi';
import SocialDistancingIcon from '../../ui/icons/social-distancing';
import UserSpeakBubble from '../../ui/icons/user-speak-bubble';
import CheckMarkCircle from '../../ui/icons/check-mark-circle';
import LineGraph from '../../ui/icons/line-graph';
import Tip from './tip';

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
}

interface State {

}

export default class Tips extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { onSkip } = this.props;
        return (
            <TipsContainer>
                <Tip icon={<WifiIcon height={40} width={40} fill={'gray'} />} title={'Stöðug nettenging'}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor erat sed est finibus, sed dictum eros mattis. Aliquam congue neque tortor, id mattis mauris condimentum sit amet.
                    </p>
                </Tip>
                <Tip icon={<SocialDistancingIcon height={40} width={40} fill={'gray'} />} title={'Tveggja metra reglan'}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor erat sed est finibus, sed dictum eros mattis. Aliquam congue neque tortor, id mattis mauris condimentum sit amet.
                    </p>
                </Tip>
                <Tip icon={<UserSpeakBubble height={40} width={40} fill={'gray'} />} title={'Yfirfara upptökur'}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor erat sed est finibus, sed dictum eros mattis. Aliquam congue neque tortor, id mattis mauris condimentum sit amet.
                    </p>
                </Tip>
                <Tip icon={<CheckMarkCircle height={40} width={40} fill={'gray'} />} title={'Klára setninguna'}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor erat sed est finibus, sed dictum eros mattis. Aliquam congue neque tortor, id mattis mauris condimentum sit amet.
                    </p>
                </Tip>
                <Tip icon={<LineGraph height={40} width={40} fill={'gray'} />} title={'Ein eða þúsund?'}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor erat sed est finibus, sed dictum eros mattis. Aliquam congue neque tortor, id mattis mauris condimentum sit amet.
                    </p>
                </Tip>
                <SkipButton onClick={onSkip}>Áfram</SkipButton>
            </TipsContainer>
        );
    }
}