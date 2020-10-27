import * as React from 'react';
import styled from 'styled-components';

import { UserClient } from '../../types/user';
import StatsItem from './stats-item';

import MicIcon from '../ui/icons/mic';
import PlayIcon from '../ui/icons/play';
import ThumbUpIcon from '../ui/icons/thumb-up';

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

export const DashboardStats: React.FunctionComponent<Props> = ({ client: { isSuperUser, stats: { clips, votes } } }) => {
    return (
        <StatsContainer>
            {
                isSuperUser && (
                    <SuperUserStatItem
                        icon={<ThumbUpIcon height={35} fill={'gray'} />}
                        title={'Ofur yfirferð'}
                    >
                        <Stat>Þú hefur yfirfarið <span>{votes?.super}</span> setningar með <span>ofur</span> atkvæðum</Stat>
                    </SuperUserStatItem>
                )
            }
            <StatsItem
                icon={<MicIcon height={40} fill={'blue'} />}
                title={'Innlesnar setningar'}
            >
                <Stats>
                    <Stat>Þú hefur lesið inn <span>{clips?.count}</span> setningar.</Stat>
                    <Stat>Þar af er búið að merkja <span>{clips?.valid}</span> góðar</Stat>
                    <Stat>og <span>{clips?.invalid}</span> slæmar</Stat>
                </Stats>
            </StatsItem>
            <StatsItem
                icon={<PlayIcon height={35} fill={'green'} />}
                title={'Yfirfarnar setningar'}
            >
                <Stat>Þú hefur yfirfarið <span>{votes?.count}</span> setningar</Stat>
            </StatsItem>
        </StatsContainer>
    )
}

export default DashboardStats;