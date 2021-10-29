import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import { CompetitionStats } from '../components/competition/competition-stats';
import Layout from '../components/layout/layout';
import { ReddumTitle } from '../components/competition/ui/reddum-title';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
    margin: 0 auto;
`;

const About = styled.div`
    max-width: 40rem;
    margin: 0 auto 2rem auto;
`;

const SelectorContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 50rem;
    margin: 0 auto;
`;

const SelectableH2 = styled.h2`
    cursor: pointer;

    & :hover {
        color: ${({ theme }) => theme.colors.darkerBlue};
    }
`;

const ExtraMargin = styled.div`
    margin-top: 5rem;
`;

const ScoreboardStatsContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    width: 100%;
`;

const Competition: React.FunctionComponent = () => {
    const [showStats, setShowStats] = useState(false);

    return (
        <Layout white>
            <CompetitionPageContainer>
                <ExtraMargin>
                    <ReddumTitle />
                </ExtraMargin>
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
                <SelectorContainer>
                    <SelectableH2 onClick={() => setShowStats(false)}>
                        Stigatafla
                    </SelectableH2>
                    <h2>{' / '}</h2>
                    <SelectableH2 onClick={() => setShowStats(true)}>
                        Línurit
                    </SelectableH2>
                </SelectorContainer>
                <ScoreboardStatsContainer>
                    {!showStats && <Scoreboard />}
                    {showStats && <CompetitionStats />}
                </ScoreboardStatsContainer>
            </CompetitionPageContainer>
        </Layout>
    );
};

export default Competition;
