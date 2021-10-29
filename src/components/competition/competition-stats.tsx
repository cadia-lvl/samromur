import * as React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import {
    getCompetitionAgeStats,
    getCompetitionGenderStats,
    getCompetitionTimeline,
} from '../../services/competition-api';
import CompetitionAgeChart from './charts/age-chart';
import CompetitionGenderChart from './charts/gender-chart';
import CompetitionTimeLineChart from './charts/timeline-chart';

const StatsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 50rem;

    & div {
        width: 50rem;
        max-height: 50rem;
    }
`;

export const CompetitionStats = () => {
    const { data: genderData, error: genderError } = useSWR(
        'gender',
        getCompetitionGenderStats
    );
    const { data: ageData, error: ageError } = useSWR(
        'age',
        getCompetitionAgeStats
    );
    const { data: timelineData, error: timelineError } = useSWR(
        'timeline',
        getCompetitionTimeline
    );

    return (
        <StatsContainer>
            {timelineData && (
                <CompetitionTimeLineChart chartData={timelineData} />
            )}
            {ageData && <CompetitionAgeChart chartData={ageData} />}
            {genderData && <CompetitionGenderChart chartData={genderData} />}
        </StatsContainer>
    );
};
