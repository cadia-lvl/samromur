import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import MicIcon from '../../ui/icons/mic';
import PlayIcon from '../../ui/icons/play';
import PhoneIcon from '../../ui/icons/phone';
import LoadingIcon from '../../ui/icons/loading';

const CardGrid = styled.div`
    min-width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    ${({ theme }) => theme.media.small} {
        min-width: 100%;
        grid-template-columns: 100%;
        grid-template-rows: auto;
    }
`;

interface CardContainerProps {
    wide?: boolean;
    disabled?: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
    display: grid;
    grid-template-columns: 2.5rem auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.8rem 1rem;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    cursor: pointer;

    & :active {
        transform: translateY(2px);
    }

    ${({ disabled }) =>
        disabled &&
        `
        pointer-events: none;
        opacity: 0.4;
        `}

    ${({ theme }) => theme.media.smallUp} {
        ${({ wide }) => wide && `grid-column: 1 / 3;`}
    }
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;

    & h3 {
        color: ${({ theme }) => theme.colors.blackOlive};
        margin: 0;
    }

    & p {
        margin: 0;
    }
`;

const spin = keyframes`
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
`;

const LoadingContainer = styled.h3`
    padding: 2rem;
    margin: auto;
    ${({ theme }) => theme.media.smallUp} {
        grid-column: span 2;
    }
    animation-name: ${spin};
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;

interface Props {
    setType: (contributeType: string) => void;
}

export const TypeSelect: React.FunctionComponent<Props> = (props) => {
    const [speakClicked, setSpeakClicked] = React.useState(false);
    const [listenClicked, setlistenClicked] = React.useState(false);
    const { setType } = props;

    //TODO: add loading animation
    const onSpeakClick = () => {
        setSpeakClicked(true);
        setType('tala');
    };

    const onlistenClick = () => {
        setlistenClicked(true);
        setType('hlusta');
    };

    return (
        <CardGrid>
            <CardContainer onClick={onSpeakClick} disabled={speakClicked}>
                <MicIcon height={50} width={50} fill={'blue'} />
                <Title>
                    <h3>Tala</h3>
                    <p>Smelltu hér til þess að lesa inn.</p>
                    <p>
                        Með því að lesa inn í Samróm leggur þitt af mörkum við
                        varðveislu íslenskunnar.
                    </p>
                </Title>
            </CardContainer>

            <CardContainer onClick={onlistenClick} disabled={listenClicked}>
                <PlayIcon height={40} width={40} fill={'red'} />
                <Title>
                    <h3>Hlusta</h3>
                    <p>Smelltu hér til að yfirfara raddupptökur</p>
                    <p>
                        Einungis upptökur sem eru yfirfarnar og merktar sem
                        góðar mega fara inn í gagnasafnið.
                    </p>
                </Title>
            </CardContainer>
            {/*             <CardContainer wide onClick={() => { }}>
                <PhoneIcon height={40} width={40} fill={'gray'} />
                <Title>
                    <h3>Samræður</h3>
                    <p>Hringja í aðra þátttakendur og taka upp samræður</p>
                </Title>
            </CardContainer> */}
            {(listenClicked || speakClicked) && (
                <LoadingContainer>
                    <LoadingIcon large />
                </LoadingContainer>
            )}
        </CardGrid>
    );
};

export default TypeSelect;
