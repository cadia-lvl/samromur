import * as React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/layout';
import H3QueriesStats from '../components/stats/h3-queries-stats';
import L2SpeakerStats from '../components/stats/l2-speaker-stats';
import RepeatAudioStats from '../components/stats/repeat-audio-stats';

const StatsContainer = styled.div`
    margin: 2rem auto;
    width: 60rem;
`;

const Stats: React.FunctionComponent = () => {
    return (
        <Layout>
            <StatsContainer>
                <RepeatAudioStats />
                <L2SpeakerStats />
                <H3QueriesStats />
            </StatsContainer>
        </Layout>
    );
};

export default Stats;
