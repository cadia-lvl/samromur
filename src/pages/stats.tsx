import * as React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/layout';
import H3QueriesStats from '../components/stats/h3-queries-stats';
import L2SpeakerStats from '../components/stats/l2-speaker-stats';
import HermaData from '../components/stats/herma-stats';

const StatsContainer = styled.div`
    margin: 2rem auto;
    width: 60rem;
`;

const Stats: React.FunctionComponent = () => {
    return (
        <Layout>
            <StatsContainer>
                <HermaData />
                <H3QueriesStats />
                <L2SpeakerStats />
            </StatsContainer>
        </Layout>
    );
};

export default Stats;
