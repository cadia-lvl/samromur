import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import { CompetitionStats } from '../components/competition/competition-stats';
import Layout from '../components/layout/layout';
import { ReddumTitle } from '../components/competition/ui/reddum-title';
import { isPreCompetition } from '../utilities/competition-helper';
import CompanyList from '../components/competition/company-list';
import * as colors from '../components/competition/ui/colors';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
    margin: 0 auto;
    width: 100%;
    max-width: 50rem;
    /* min-width: 30rem; */
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
                    <p>Reddum málinu vinnustaðakeppni 8. - 16. nóvember.</p>
                    <p>
                        Allir geta tekið þátt í að „redda málinu“ en við hvetjum
                        vinnustaði til þess að fylkja liði og skrá sig í
                        keppnina.
                    </p>
                    <p>
                        Keppt verður í þremur flokkum, eftir stærð vinnustaða og
                        viðurkenning verður veitt fyrir þrjú efstu sætin í
                        hverjum flokki.
                    </p>
                </About>
                {isPreCompetition() && (
                    <>
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
                            {!showStats && <Scoreboard pre />}
                            {showStats && <CompetitionStats pre />}
                        </ScoreboardStatsContainer>
                    </>
                )}
                {!isPreCompetition() && <CompanyList />}
            </CompetitionPageContainer>
        </Layout>
    );
};

export default Competition;
