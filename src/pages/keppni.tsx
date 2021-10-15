import * as React from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import Layout from '../components/layout/layout';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
`;

const About = styled.div`
    max-width: 50rem;
    margin: 0 auto;
`;

const CompetitionStats: React.FunctionComponent = () => {
    return (
        <Layout>
            <CompetitionPageContainer>
                <About>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Tenetur porro dolore pariatur nihil consequuntur velit
                        corrupti modi reprehenderit nam incidunt! Minus nisi
                        molestiae consectetur quidem soluta numquam nostrum, non
                        sequi.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Aliquam laudantium quis adipisci delectus, facere
                        quod inventore iure quibusdam! Adipisci blanditiis quasi
                        eum dolor sequi praesentium. Quod consequatur
                        perferendis quidem non.
                    </p>
                </About>
                <Scoreboard />
            </CompetitionPageContainer>
        </Layout>
    );
};

export default CompetitionStats;
