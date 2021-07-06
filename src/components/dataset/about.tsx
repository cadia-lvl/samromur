import * as React from 'react';
import styled from 'styled-components';

import CircleStat from './circle-stat';
import PlayIcon from '../ui/icons/play';
import MicIcon from '../ui/icons/mic';
import GlobeIcon from '../ui/icons/globe';

import { averageClipSeconds } from '../../constants/stats';
import { useTranslation } from '../../server/i18n';
import { Trans } from 'react-i18next';

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
    const { t } = useTranslation('database');
    return (
        <AboutDatasetContainer>
            <StatsContainer>
                <CircleStat
                    color={'validGreen'}
                    label={t('verified-hours')}
                    value={t('hrs', { number: validatedHours })}
                    icon={
                        <PlayIcon height={30} width={30} fill={'validGreen'} />
                    }
                />
                <CircleStat
                    color={'red'}
                    label={t('recorded-hours')}
                    value={t('hrs', { number: clipsHours })}
                    icon={<MicIcon height={30} width={30} fill={'red'} />}
                />
                <CircleStat
                    color={'blue'}
                    label={t('number-of-voices')}
                    value={clients.toString()}
                    icon={<GlobeIcon height={30} width={30} fill={'blue'} />}
                />
            </StatsContainer>
            <AboutContainer>
                <h2>{t('database.title')}</h2>
                <span>{t('database.beginning')}</span>
                <span>{t('database.middle')}</span>
                <span>
                    <Trans i18nKey={'database.end'} t={t}>
                        Gagnasafnið verður gefið út á{' '}
                        <StyledLink
                            target={'blank'}
                            href={'https://clarin.is/ '}
                        >
                            Clarin
                        </StyledLink>
                        . Skráðu þig á póstlistann hér fyrir neðan til þess að
                        fá tilkynningu þegar gagnasafnið verður gert
                        aðgengilegt.
                    </Trans>
                </span>
            </AboutContainer>
        </AboutDatasetContainer>
    );
};

export default AboutDataset;
