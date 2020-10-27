import * as React from 'react';
import styled from 'styled-components';
import MicIcon from '../../ui/icons/mic';
import PlayIcon from '../../ui/icons/play';
import PhoneIcon from '../../ui/icons/phone';

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
}

const CardContainer = styled.div<CardContainerProps>`
    display: grid;
    grid-template-columns: 2.5rem auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.8rem 1rem;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    box-shadow: 0 0 3px 1px rgba(0,0,0,.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0,0,0,.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0,0,0,.08);
    cursor: pointer;

    & :active {
        transform: translateY(2px);
    }

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

interface Props {
    setType: (contributeType: string) => void;
}

export const TypeSelect: React.FunctionComponent<Props> = (props) => {

    const { setType } = props;
    return (
        <CardGrid>
            <CardContainer onClick={() => setType('tala')}>
                <MicIcon height={50} width={50} fill={'blue'} />
                <Title>
                    <h3>Tala</h3>
                    <p>Smelltu hér til þess að lesa inn.</p>
                    <p>Með því að lesa inn í Samróm leggur þitt af mörkum við varðveislu íslenskunnar.</p>

                </Title>
            </CardContainer>

            <CardContainer onClick={() => setType('hlusta')}>
                <PlayIcon height={40} width={40} fill={'red'} />
                <Title>
                    <h3>Hlusta</h3>
                    <p>Smelltu hér til að yfirfara raddupptökur</p>
                    <p>Einungis upptökur sem eru yfirfarnar og merktar sem góðar mega fara inn í gagnasafnið.</p>
                </Title>
            </CardContainer>
{/*             <CardContainer wide onClick={() => { }}>
                <PhoneIcon height={40} width={40} fill={'gray'} />
                <Title>
                    <h3>Samræður</h3>
                    <p>Hringja í aðra þátttakendur og taka upp samræður</p>
                </Title>
            </CardContainer> */}

        </CardGrid>
    );
}

export default TypeSelect;