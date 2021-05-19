import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import MicIcon from '../../ui/icons/mic';
import PlayIcon from '../../ui/icons/play';
import LoadingIcon from '../../ui/icons/loading';
import Volume from '../../ui/icons/volume';

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

enum Options {
    speak = 'tala',
    listen = 'hlusta',
    repeat = 'herma',
}

type Option = Options | undefined;

interface Props {
    setType: (contributeType: string) => void;
}

export const TypeSelect: React.FunctionComponent<Props> = (props) => {
    const [selectedOption, setSelectedOption] = React.useState<Option>(
        undefined
    );
    const { setType } = props;

    const onSpeakClick = () => {
        setSelectedOption(Options.speak);
        setType(Options.speak);
    };

    const onlistenClick = () => {
        setSelectedOption(Options.listen);
        setType(Options.listen);
    };

    const onRepeatClick = () => {
        setSelectedOption(Options.repeat);
        setType(Options.repeat);
    };

    return (
        <CardGrid>
            <CardContainer
                onClick={onSpeakClick}
                disabled={selectedOption && selectedOption !== Options.speak}
            >
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

            <CardContainer
                onClick={onlistenClick}
                disabled={selectedOption && selectedOption !== Options.listen}
            >
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
            <CardContainer
                wide
                onClick={onRepeatClick}
                disabled={selectedOption && selectedOption !== Options.repeat}
            >
                <Volume height={40} width={40} fill={'green'} />
                <Title>
                    <h3>Herma eftir setningu</h3>
                    <p>
                        Hér getur þú gefið til söfnunarinnar með því að herma
                        eftir lesinni setningu.{' '}
                    </p>
                    <p>
                        Með því að lesa inn í Samróm leggur þitt af mörkum við
                        varðveislu íslenskunnar.
                    </p>
                </Title>
            </CardContainer>
            {selectedOption && (
                <LoadingContainer>
                    <LoadingIcon large />
                </LoadingContainer>
            )}
        </CardGrid>
    );
};

export default TypeSelect;
