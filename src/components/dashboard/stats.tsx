import * as React from 'react';
import styled from 'styled-components';

import { UserClient } from '../../types/user';
import StatsItem from './stats-item';

import MicIcon from '../ui/icons/mic';
import PlayIcon from '../ui/icons/play';
import ThumbUpIcon from '../ui/icons/thumb-up';
import { useTranslation } from '../../server/i18n';
import { Trans } from 'react-i18next';

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(auto-fill, minmax(10rem, auto));
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
        isSuperUser,
        stats: { clips, votes },
    },
}) => {
    const { t } = useTranslation('my-pages');
    const superVotes = votes ? votes.super : 0;
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
        </StatsContainer>
    );
};

export default DashboardStats;
