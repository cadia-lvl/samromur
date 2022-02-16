import * as React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import {
    getCompetitionAgeStats,
    getCompetitionGenderStats,
    getCompetitionTimeline,
    getPreCompetitionAgeStats,
    getPreCompetitionGenderStats,
    getPreCompetitionTimeline,
} from '../../services/competition-api';
import {
    getStaticCompetitionAgeStats,
    getStaticCompetitionGenderStats,
    getStaticCompetitionTimelineStats,
} from '../../utilities/competition-helper';
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
    const {
        data: genderData,
        error: genderError,
    } = getStaticCompetitionGenderStats();
    const { data: ageData, error: ageError } = getStaticCompetitionAgeStats();
    const {
        data: timelineData,
        error: timelineError,
    } = getStaticCompetitionTimelineStats();
    return (
        <StatsContainer>
            {timelineData && (
                <CompetitionTimeLineChart chartData={timelineData} />
            )}
            {!timelineData && !timelineError && <Loader />}
            {ageData && <CompetitionAgeChart chartData={ageData} />}
            {!ageData && !ageError && <Loader />}
            {genderData && <CompetitionGenderChart chartData={genderData} />}
            {!genderData && !genderError && <Loader />}
        </StatsContainer>
    );
};

CompetitionStats.defaultProps = {
    pre: false,
};
