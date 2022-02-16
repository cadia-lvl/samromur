// This contains the stats component for the reddum malinu competitions
import * as React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { ageStats, genderStats, timeline } from '../../constants/reddumResults';
import {
    getCompetitionAgeStats,
    getCompetitionGenderStats,
    getCompetitionTimeline,
    getPreCompetitionAgeStats,
    getPreCompetitionGenderStats,
    getPreCompetitionTimeline,
} from '../../services/competition-api';
import Loader from '../ui/animated/loader';
import CompetitionAgeChart from './charts/age-chart';
import CompetitionGenderChart from './charts/gender-chart';
import CompetitionTimeLineChart from './charts/timeline-chart';

const StatsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-width: 50rem;
    box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 1px;
    padding: 1rem;
    background-color: white;

    & div {
        width: 100%;
        min-height: 5rem;
    }
`;

interface Props {
    pre?: boolean;
}

export const CompetitionStats: React.FunctionComponent<Props> = (
    props: Props
) => {
    // const { data: genderData, error: genderError } = useSWR(
    //     'gender',
    //     props.pre ? getPreCompetitionGenderStats : getCompetitionGenderStats
    // );
    // const { data: ageData, error: ageError } = useSWR(
    //     'age',
    //     props.pre ? getPreCompetitionAgeStats : getCompetitionAgeStats
    // );
    // const { data: timelineData, error: timelineError } = useSWR(
    //     'timeline',
    //     props.pre ? getPreCompetitionTimeline : getCompetitionTimeline
    // );

    const genderData = genderStats;
    const ageData = ageStats;
    const timelineData = timeline;

    return (
        <StatsContainer>
            {timelineData && (
                <CompetitionTimeLineChart chartData={timelineData} />
            )}
            {!timelineData && <Loader />}
            {ageData && <CompetitionAgeChart chartData={ageData} />}
            {!ageData && <Loader />}
            {genderData && <CompetitionGenderChart chartData={genderData} />}
            {!genderData && <Loader />}
        </StatsContainer>
    );
};

CompetitionStats.defaultProps = {
    pre: false,
};
