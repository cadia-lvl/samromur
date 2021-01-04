import * as React from 'react';
import styled from 'styled-components';

import CircleStat from './circle-stat';
import PlayIcon from '../ui/icons/play';
import MicIcon from '../ui/icons/mic';
import GlobeIcon from '../ui/icons/globe';

import { averageClipSeconds } from '../../constants/stats';

const AboutDatasetContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    max-width: 100%;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
    }
    gap: 3rem;
`;
const StyledLink = styled.a`
    color: ${({ theme }) => theme.colors.blue};
    :visited,
    :focus {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blue};
    }

    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blackOlive};
    }
`;

const StatsContainer = styled.div`
    display: flex;
    flex-direction: column;
    & > div {
        margin-bottom: 1.5rem;
    }
`;

const AboutContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 0.9rem;
`;

interface Props {
    clips: number;
    clients: number;
    validated: number;
}

export const AboutDataset: React.FunctionComponent<Props> = ({
    clips,
    clients,
    validated,
}) => {
    const clipsHours = Math.round((averageClipSeconds * clips) / 3600);
    const validatedHours = Math.round((averageClipSeconds * validated) / 3600);
    return (
        <AboutDatasetContainer>
            <StatsContainer>
                <CircleStat
                    color={'validGreen'}
                    label={'Staðfestar klukkustundir'}
                    value={`${validatedHours} klst`}
                    icon={
                        <PlayIcon height={30} width={30} fill={'validGreen'} />
                    }
                />
                <CircleStat
                    color={'red'}
                    label={'Uppteknar klukkustundir'}
                    value={`${clipsHours} klst`}
                    icon={<MicIcon height={30} width={30} fill={'red'} />}
                />
                <CircleStat
                    color={'blue'}
                    label={'Fjöldi radda'}
                    value={clients.toString()}
                    icon={<GlobeIcon height={30} width={30} fill={'blue'} />}
                />
            </StatsContainer>
            <AboutContainer>
                <h2>Gagnasafnið Samrómur</h2>
                <span>
                    Samrómur er opið og aðgengilegt gagnasafn radda sem öllum er
                    frjálst að nýta við þróun hugbúnaðar á íslensku.
                </span>
                <span>
                    Gagnasafnið samanstendur af setningum og hljóðbrotum af
                    upplestri þeirra setninga ásamt lýsigögnum. Hver færsla í
                    gagnasafninu inniheldur WAV-hljóðbrot og samsvarandi
                    textaskrá.
                </span>
                <span>
                    Gagnasafnið verður gefið út á{' '}
                    <StyledLink target={'blank'} href={'https://clarin.is/ '}>
                        Clarin
                    </StyledLink>
                    . Skráðu þig á póstlistann hér fyrir neðan til þess að fá
                    tilkynningu þegar gagnasafnið verður gert aðgengilegt.
                </span>
            </AboutContainer>
        </AboutDatasetContainer>
    );
};

export default AboutDataset;
