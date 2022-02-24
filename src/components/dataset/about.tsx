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

const Bold = styled.span`
    font-weight: bold;
`;

const Dataset = styled.span``;

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
    const { t } = useTranslation('the-database');
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
                <span>{t('database.preface-releases')}</span>
                <Dataset>
                    <Bold>
                        Samrómur 21.05
                        <br />
                    </Bold>
                    <Trans i18nKey={'database.samromur-21-05'} t={t}>
                        Þetta er fyrsta útgáfan af gögnum úr safni Samróms.
                        Útgáfan inniheldur 100.000 (145 klst.) staðfestar
                        talupptökur á íslensku, fáanlegar bæði ás{' '}
                        <StyledLink
                            target={'blank'}
                            href={'http://hdl.handle.net/20.500.12537/189'}
                        >
                            Clarin
                        </StyledLink>{' '}
                        og{' '}
                        <StyledLink
                            target={'blank'}
                            href={'https://www.openslr.org/112/'}
                        >
                            OpenSLR
                        </StyledLink>
                        .
                    </Trans>
                </Dataset>
                <Dataset>
                    <Bold>
                        Samrómur Children 21.09
                        <br />
                    </Bold>
                    <Trans i18nKey={'database.samromur-children'} t={t}>
                        Þessi útgáfa gagna úr safni Samróms einblínir á börn
                        (4-17 ára). Útgáfan inniheldur 137.000 (131 klst.)
                        staðfestar talupptökur frá börnum á íslensku, fáanlegar
                        bæði á{' '}
                        <StyledLink
                            target={'blank'}
                            href={'http://hdl.handle.net/20.500.12537/185'}
                        >
                            Clarin
                        </StyledLink>{' '}
                        og{' '}
                        <StyledLink
                            target={'blank'}
                            href={'https://www.openslr.org/117/'}
                        >
                            OpenSLR
                        </StyledLink>
                        .
                    </Trans>
                </Dataset>
                <Dataset>
                    <Bold>
                        Samrómur Queries 21.12
                        <br />
                    </Bold>
                    <Trans i18nKey={'database.samromur-queries'} t={t}>
                        Þessi útgáfa gagna úr safni Samróms einblínir á
                        fyrirspurnir. Útgáfan inniheldur 17.475 (20 klst.)
                        staðfestar talupptökur á íslensku, fáanlegar bæði á{' '}
                        <StyledLink
                            target={'blank'}
                            href={'http://hdl.handle.net/20.500.12537/180'}
                        >
                            Clarin
                        </StyledLink>{' '}
                        og{' '}
                        <StyledLink
                            target={'blank'}
                            href={'https://www.openslr.org/116/'}
                        >
                            OpenSLR
                        </StyledLink>
                        .
                    </Trans>
                </Dataset>

                <span>{t('database.sign-up-for-updates')}</span>
            </AboutContainer>
        </AboutDatasetContainer>
    );
};

export default AboutDataset;
