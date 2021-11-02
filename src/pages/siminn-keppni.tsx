import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import { CompetitionStats } from '../components/competition/competition-stats';
import Layout from '../components/layout/layout';
import { ReddumTitle } from '../components/competition/ui/reddum-title';
import { isPreCompetition } from '../utilities/competition-helper';
import CompanyList from '../components/competition/company-list';
import Link from 'next/link';
import * as colors from '../components/competition/ui/colors';
import ReddumMalinuWhite from '../components/ui/logos/reddum-malinu';
import PrimaryButton from '../components/competition/ui/comp-button-primary';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { getPreCompetitionScores } from '../services/competition-api';

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
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto 2rem auto;
    color: white;
    text-align: center;
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
    color: white;

    & :hover {
        color: ${({ theme }) => theme.colors.darkerBlue};
    }
`;

const Separator = styled.h2`
    color: white;
`;

const ExtraMargin = styled.div`
    margin-top: 5rem;
`;

const ScoreboardStatsContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    width: 100%;
`;

const StyledLink = styled.a`
    color: ${colors.siminn};

    :visited {
        text-decoration: none;
        color: ${colors.siminn};
    }

    :focus,
    :hover {
        text-decoration: none;
        color: ${colors.purple1};
    }
`;

const Competition: React.FunctionComponent = () => {
    const [showStats, setShowStats] = useState(false);
    const { data, error } = useSWR(
        'competition-scores',
        getPreCompetitionScores
    );

    const router = useRouter();

    return (
        <Layout>
            <CompetitionPageContainer>
                <ExtraMargin>
                    <ReddumTitle color={'white'} />
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
                    {isPreCompetition() ? (
                        <>
                            <p>Smelltu á „Taka þátt“ til að reddu málinu!</p>
                            <PrimaryButton onClick={() => router.push('/tala')}>
                                Taka þátt{' '}
                            </PrimaryButton>
                            {/* <Link href="/tala" passHref>
                                <StyledLink>
                                    Smelltu á her til að reddu málinu!
                                </StyledLink>
                            </Link> */}
                        </>
                    ) : (
                        <>
                            <p>Smelltu á „Skrá“ til að skrá!</p>
                            <PrimaryButton onClick={() => router.push('/skra')}>
                                Skrá
                            </PrimaryButton>
                        </>
                        // <Link href="/skra" passHref>
                        //     <StyledLink>Smelltu hér til að skrá!</StyledLink>
                        // </Link>
                    )}
                </About>
                {isPreCompetition() && (
                    <>
                        <SelectorContainer>
                            <SelectableH2 onClick={() => setShowStats(false)}>
                                Stigatafla
                            </SelectableH2>
                            <Separator>{' / '}</Separator>
                            <SelectableH2 onClick={() => setShowStats(true)}>
                                Línurit
                            </SelectableH2>
                        </SelectorContainer>
                        <ScoreboardStatsContainer>
                            {!showStats && <Scoreboard pre blue data={data} />}
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
