import * as React from 'react';
import styled from 'styled-components';

import { UserClient } from '../../types/user';
import StatsItem from './stats-item';

import MicIcon from '../ui/icons/mic';
import PlayIcon from '../ui/icons/play';
import GlobeIcon from '../ui/icons/globe';
import ThumbUpIcon from '../ui/icons/thumb-up';
import { useTranslation } from '../../server/i18n';
import { Trans } from 'react-i18next';
import { StyledLink } from '../ui/links';
import Link from 'next/link';
import useSWR from 'swr';
import {
    getUserCaptiniStats,
    getUserL2Stats,
    getUserGK2022Stats,
} from '../../services/stats-api';

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-auto-rows: min-content;
    gap: 2rem;
    padding: 2rem;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
    }
`;

const Stats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Stat = styled.div`
    font-size: 1.1rem;
    & span {
        vertical-align: middle;
        font-size: 1.5rem;
        font-weight: 600;
    }
`;

const SuperUserStatItem = styled(StatsItem)`
    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
    }
`;

interface Props {
    client: UserClient;
}

export const DashboardStats: React.FunctionComponent<Props> = ({
    client: {
        id,
        isSuperUser,
        stats: { clips, votes },
    },
}) => {
    const { t } = useTranslation('my-pages');
    const { data, error } = useSWR(['captini', id], getUserCaptiniStats);
    const { data: dataL2, error: errorL2 } = useSWR(['l2', id], getUserL2Stats);
    const { data: dataGK2022, error: errorGK2022 } = useSWR(
        id,
        getUserGK2022Stats
    );
    const superVotes = votes ? votes.super : 0;
    const total = data ? data.total : 0;
    const clientTotal = data ? (data.client_total ? data.client_total : 0) : 0;
    const totalL2 = dataL2 ? dataL2.total : 0;
    const clientTotalL2 = dataL2 ? (dataL2.client_total ? dataL2.client_total : 0) : 0;
    const clientCompetitionTotal = dataGK2022 ? dataGK2022.client_total : 0;
    return (
        <StatsContainer>
            {isSuperUser && (
                <SuperUserStatItem
                    icon={<ThumbUpIcon height={35} fill={'gray'} />}
                    title={t('statistics.super-verification-title')}
                >
                    <Stat>
                        <Trans
                            i18nKey="statistics.super-verification-text"
                            t={t}
                        >
                            Þú hefur yfirfarið <span>{{ superVotes }}</span>{' '}
                            setningar með
                            <span>ofur</span> atkvæðum
                        </Trans>
                    </Stat>
                </SuperUserStatItem>
            )}
            <SuperUserStatItem
                icon={<MicIcon height={40} fill={'blue'} />}
                title={'Grunnskólakepnni 2022'}
            >
                <Stats>
                    <Stat>
                        Þú hefur lesið inn <span>{clientCompetitionTotal}</span>{' '}
                        setningar í Grunnskólakeppninni.
                    </Stat>
                </Stats>
            </SuperUserStatItem>

            <StatsItem
                icon={<MicIcon height={40} fill={'blue'} />}
                title={t('statistics.read-sentences-title')}
            >
                <Stats>
                    <Trans i18nKey="statistics.read-sentences-text" t={t}>
                        <Stat>
                            Þú hefur lesið inn{' '}
                            <span>{{ sentences: clips?.count }}</span>{' '}
                            setningar.
                        </Stat>
                        <Stat>
                            Þar af er búið að merkja{' '}
                            <span>{{ good: clips?.valid }}</span> góðar
                        </Stat>
                        <Stat>
                            og <span>{{ bad: clips?.invalid }}</span> slæmar
                        </Stat>
                    </Trans>
                </Stats>
            </StatsItem>
            <StatsItem
                icon={<PlayIcon height={35} fill={'green'} />}
                title={t('statistics.verified-sentences-title')}
            >
                <Stat>
                    <Trans i18nKey="statistics.verified-sentences-text" t={t}>
                        Þú hefur yfirfarið{' '}
                        <span>{{ sentences: votes?.count }}</span> setningar
                    </Trans>
                </Stat>
            </StatsItem>
            <SuperUserStatItem
                icon={<GlobeIcon height={35} fill={'gray'} />}
                title={'Captini'}
            >
                <Stat>
                    <Trans i18nKey="statistics.captini-text" t={t}>
                        Þú hefur lesið <span>{{ clientTotal }}</span> af
                        <span> {{ total }}</span> setningum.
                    </Trans>
                    <br />
                    <Link href="/captini" passHref>
                        <StyledLink>
                            Smelltu hér til að halda áfram með captini
                        </StyledLink>
                    </Link>
                </Stat>
            </SuperUserStatItem>
            <SuperUserStatItem
                icon={<GlobeIcon height={35} fill={'gray'} />}
                title={'L2 Safn'}
            >
                <Stat>
                    <Trans i18nKey="statistics.l2-text" t={t}>
                        Þú hefur lesið <span>{{ clientTotalL2 }}</span> setningar
                    </Trans>
                    <br />
                    <Link href="/l2" passHref>
                        <StyledLink>
                            Smelltu hér til að halda áfram að lesa
                        </StyledLink>
                    </Link>
                </Stat>
            </SuperUserStatItem>
        </StatsContainer>
    );
};

export default DashboardStats;
