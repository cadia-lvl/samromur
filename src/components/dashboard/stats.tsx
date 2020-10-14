import * as React from 'react';
import styled from 'styled-components';

import { UserStats } from '../../types/user';
import StatsItem from './stats-item';
import MicIcon from '../ui/icons/mic';
import PlayIcon from '../ui/icons/play';

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

interface Props {
    stats: UserStats;
}

export const DashboardStats: React.FunctionComponent<Props> = ({ stats: { clips, votes } }) => (
    <StatsContainer>
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

export default DashboardStats;