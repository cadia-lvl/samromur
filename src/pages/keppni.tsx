import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import Layout from '../components/layout/layout';
// import { ReddumTitle } from '../components/competition/ui/reddum-title';
import { isCompetition } from '../utilities/competition-helper';
import CompanyList from '../components/competition/company-list';
import Link from 'next/link';
// import * as colors from '../components/competition/ui/colors';
import { useRouter } from 'next/router';
// import PrimaryButton from '../components/competition/ui/comp-button-primary';
import { Button } from '../components/ui/buttons';
import useSWR from 'swr';
import { getCompetitionScores } from '../services/competition-api';
import { ScoreboardData } from '../types/competition';
import { CompetitionStats } from '../components/competition/competition-stats';
import ReddumMalinuWhite from '../components/ui/logos/reddum-malinu';
import { theme } from '../styles/global';
import { StyledLink } from '../components/ui/links/link';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* align-items: center; */
    padding: 1rem;
    margin: 0 auto;
    width: 100%;
    max-width: 50rem;
    /* min-width: 30rem; */
`;

const About = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto 2rem auto;
    /* text-align: center; */
`;

const BottomContent = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};

    margin: 2rem 0;
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

const TitleContainer = styled.div``;

const ScoreboardStatsContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    width: 100%;
    color: black; ;
`;

const CompanyListContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface ButtonProps {
    color: string;
}

const CTAButton = styled.button<ButtonProps>`
    flex: 1;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    padding: 0.5rem;
    background-color: ${({ color, theme }) => theme.colors[color]};
    color: white;
    cursor: pointer;
    width: 100%;
    max-width: 20rem;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 1px solid white;
    transition: color, background-color 0.1s ease-in-out;

    & :active {
        transform: translateY(2px);
    }

    & :hover {
        background-color: white;
        color: ${({ color, theme }) => theme.colors[color]};
        border: 1px solid ${({ color, theme }) => theme.colors[color]};
    }
`;

interface SelectButtonProps {
    selected?: boolean;
}

const SelectButton = styled(Button)<SelectButtonProps>`
    padding: 0.5rem;
    border-radius: 0;
    color: ${({ theme }) => theme.colors.darkerBlue};
    background-color: white;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color, background-color 0.1s ease-in-out;

    ${({ selected, theme }) =>
        selected
            ? `
        background-color: ${theme.colors.darkerBlue};
        color: white;
        `
            : ``}

    & :active {
        transform: none;
    }

    & :hover {
        ${({ theme }) =>
            `
                background-color: ${theme.colors.darkerBlue};
                color: white;
            `}
    }
    border: 1px solid ${({ theme }) => theme.colors.darkerBlue};
`;

const SelectorButtons = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    text-align: left;
    width: inherit;
    margin-left: 1px;
`;

const LogoContainer = styled.div`
    max-width: 20rem;
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

    return (
        <Layout>
            <CompetitionPageContainer>
                <TitleContainer>
                    <LogoContainer>
                        <ReddumMalinuWhite fill={theme.colors.darkerBlue} />
                    </LogoContainer>
                </TitleContainer>
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
                    {isCompetition() ? (
                        // <Link href="/tala" passHref>
                        //     <StyledLink>
                        //         Smelltu hér til að reddu málinu!
                        //     </StyledLink>
                        // </Link>
                        <>
                            <p>Smelltu á „Taka þátt“ til að reddu málinu!</p>
                            <CTAButton
                                color={'darkerBlue'}
                                onClick={() => router.push('/tala')}
                            >
                                Taka þátt{' '}
                            </CTAButton>
                        </>
                    ) : (
                        <>
                            <p>Smelltu á „Skrá“ til að skrá!</p>
                            <CTAButton
                                color={'darkerBlue'}
                                onClick={() => router.push('/skra')}
                            >
                                Skrá
                            </CTAButton>
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
                <BottomContent>
                    <Link href="/grunnskolakeppni" passHref>
                        <StyledLink>
                            Ertu að leita að Grunnskólakeppninni?
                        </StyledLink>
                    </Link>
                </BottomContent>
            </CompetitionPageContainer>
        </Layout>
    );
};

export default Competition;
