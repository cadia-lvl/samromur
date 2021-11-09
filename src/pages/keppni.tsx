import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import { CompetitionStats } from '../components/competition/competition-stats';
import Layout from '../components/layout/layout';
import { ReddumTitle } from '../components/competition/ui/reddum-title';
import { isCompetition } from '../utilities/competition-helper';
import CompanyList from '../components/competition/company-list';
import Link from 'next/link';
import * as colors from '../components/competition/ui/colors';
import { useRouter } from 'next/router';
import PrimaryButton from '../components/competition/ui/comp-button-primary';
import useSWR from 'swr';
import { getCompetitionScores } from '../services/competition-api';
import { ScoreboardData } from '../types/competition';
import Loader from '../components/ui/animated/loader';

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
    color: white;
`;

const About = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto 2rem auto;
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

    & :hover {
        color: ${colors.siminn};
    }
`;

const ExtraMargin = styled.div`
    margin-top: 5rem;
`;

const ScoreboardStatsContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    width: 100%;
    color: black; ;
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

const CompanyListContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface SelectButtonProps {
    selected?: boolean;
}

const SelectButton = styled(PrimaryButton)<SelectButtonProps>`
    padding: 0.5rem;
    border-radius: 0;

    ${({ selected }) =>
        selected
            ? `
        background-color: ${colors.siminn}; 
        color: white;
        `
            : ``}

    & :active {
        transform: none;
    }
`;

const SelectorButtons = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    text-align: left;
    width: inherit;
`;

enum CompanySizes {
    all = 'all',
    small = 'small',
    medium = 'medium',
    large = 'large',
}

const Competition: React.FunctionComponent = () => {
    const [showStats, setShowStats] = useState(false);
    const [selectedSize, setSelectedSize] = useState<CompanySizes | undefined>(
        CompanySizes.all
    );
    const { data, error } = useSWR('competition-scores', getCompetitionScores);
    const [filteredData, setFilteredData] = useState<
        ScoreboardData[] | undefined
    >(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const router = useRouter();

    const onSelectorClick = (size: CompanySizes) => {
        setSelectedSize(size);
        filterData(size);
        setShowStats(false);
    };

    const filterData = (size: CompanySizes) => {
        if (data == undefined) {
            return;
        }
        if (size == CompanySizes.all) {
            setFilteredData(data);
            return;
        }
        const filtered = data.filter((e) => e.size == size);
        const reRanked = filtered.map((e, index) => {
            const reRank: ScoreboardData = {
                ...e,
                rank: index + 1,
            };
            return reRank;
        });
        setFilteredData(reRanked);
    };

    const onShowStats = () => {
        setSelectedSize(undefined);
        setShowStats(true);
    };

    const onContributeClick = () => {
        setLoading(true);
        router.push('/tala');
    };

    return (
        <Layout>
            <CompetitionPageContainer>
                <ExtraMargin>
                    <ReddumTitle color={'white'} />
                </ExtraMargin>
                <About>
                    <p>Reddum málinu vinnustaðakeppni 8. - 15. nóvember.</p>
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
                    {isCompetition() ? (
                        // <Link href="/tala" passHref>
                        //     <StyledLink>
                        //         Smelltu hér til að reddu málinu!
                        //     </StyledLink>
                        // </Link>
                        <>
                            <p>Smelltu á „Taka þátt“ til að redda málinu!</p>
                            {!loading ? (
                                <PrimaryButton onClick={onContributeClick}>
                                    Taka þátt{' '}
                                </PrimaryButton>
                            ) : (
                                <Loader fill={'white'} />
                            )}
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
                {isCompetition() && (
                    <>
                        <SelectorContainer>
                            <SelectableH2
                                onClick={() =>
                                    onSelectorClick(CompanySizes.all)
                                }
                            >
                                Stigatafla
                            </SelectableH2>
                            <h2>{' / '}</h2>
                            <SelectableH2 onClick={() => onShowStats()}>
                                Línurit
                            </SelectableH2>
                        </SelectorContainer>
                        <SelectorButtons>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.all)
                                }
                                selected={selectedSize == CompanySizes.all}
                            >
                                Allir
                            </SelectButton>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.small)
                                }
                                selected={selectedSize == CompanySizes.small}
                            >
                                Litlir
                            </SelectButton>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.medium)
                                }
                                selected={selectedSize == CompanySizes.medium}
                            >
                                Miðlungs
                            </SelectButton>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.large)
                                }
                                selected={selectedSize == CompanySizes.large}
                            >
                                Stórir
                            </SelectButton>
                        </SelectorButtons>
                        <ScoreboardStatsContainer>
                            {!showStats && (
                                <Scoreboard blue data={filteredData} />
                            )}
                            {showStats && <CompetitionStats />}
                        </ScoreboardStatsContainer>
                    </>
                )}
                {!isCompetition() && (
                    <CompanyListContainer>
                        <CompanyList />
                    </CompanyListContainer>
                )}
            </CompetitionPageContainer>
        </Layout>
    );
};

export default Competition;
