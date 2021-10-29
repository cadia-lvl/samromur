import * as React from 'react';
import Countdown from 'react-countdown';
import styled from 'styled-components';

import { schools } from '../../constants/schools';
import {
    endTime,
    lastDay,
    revealResultsTime,
    startTime,
} from '../../pages/grunnskolakeppni';

import { IndividualStat, SchoolStat } from '../../types/competition';
import AgeGenderChart from '../dataset/charts/age-gender-chart';
import CompetitionAgeChart from './charts/age-chart';
import CompetitionGenderChart from './charts/gender-chart';
import CompetitionTimeLineChart from './charts/timeline-chart';
import { competitionTimeline } from './charts/timeline';
import { competitionAgeStats } from './charts/age';
import { competitionGenderStats } from './charts/gender';

const LeaderboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 50rem;
    margin: 0 auto;
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
`;

interface TitleContainerProps {
    doubleColumns?: boolean;
}

const TitleContainer = styled.div<TitleContainerProps>`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    max-width: 45%;

    & a {
        margin-top: 0.5rem;
    }
    ${({ theme }) => theme.media.small} {
        max-width: 100%;
    }
    ${({ doubleColumns }) => doubleColumns && 'max-width: 100%; flex: 2 0 100%'}
`;

const SubTitle = styled.div`
    display: flex;
    align-items: center;
    & a {
        margin-left: 1rem;
    }
`;

const CategoryTitle = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.darkerBlue};
    color: white;
    width: 100%;
`;

const TabSelector = styled.div`
    display: flex;
    flex-flow: row wrap;
    grid-template-columns: repeat(6, min-content);
    //border: 1px solid ${({ theme }) => theme.colors.borderGray};
    margin-bottom: 1.5rem;
    flex: 1;
`;

interface TabProps {
    selected: boolean;
}

const Tab = styled.div<TabProps>`
    padding: 1rem;
    background-color: ${({ selected, theme }) =>
        selected ? '#EBEBEB' : 'inherit'};
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    cursor: pointer;
    transition: 0.3s;
    flex-grow: 1;
    text-align: center;
`;

interface ColumnProps {
    allColumns: boolean;
    createSuspense?: boolean;
}

const LeaderboardContent = styled.div<ColumnProps>`
    display: grid;
    grid-template-columns: min-content auto ${({ allColumns }) =>
            allColumns ? 'min-content' : ''}min-content min-content;
    width: 100%;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.borderGray};

    & span {
        padding: 0.5rem 1rem;
    }

    ${({ theme }) => theme.media.small} {
        grid-template-columns: min-content 45% auto;

        & span {
            font-size: calc(2vmin + 6px);
        }
    }

    ${({ createSuspense }) =>
        createSuspense &&
        `
        filter: blur(0.3rem);
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
        pointer-events: none;
        
    `}
`;

const StyledLink = styled.a`
    color: ${({ theme }) => theme.colors.blue};
    :visited,
    :focus {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blue};
    }

    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blackOlive};
    }
    flex: 1;
`;

const CountDownContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    font-size: 1.5rem;
    justify-content: center;
    align-items: center;
`;

const StyledCountDown = styled(Countdown)`
    margin: 0 auto;
`;

const StyledImage = styled.img`
    width: 100%;
    margin: 0.5rem auto;
`;

const FinishedText = styled.div``;

interface ConditionalMobileTextProps {
    mobile: string;
    desktop: string;
}

const ConditionalMobileText = styled.span<ConditionalMobileTextProps>`
    & ::after {
        content: ${({ desktop }) => `"${desktop}"`};
    }

    ${({ theme }) => theme.media.small} {
        & ::after {
            content: ${({ mobile }) => `"${mobile}"`};
        }
    }
`;

interface CellProps {
    align?: string;
    thick?: boolean;
    darker?: boolean;
    disableMobile?: boolean;
    mobileText?: string;
    desktopText?: string;
    disabled?: boolean;
}

const HeaderItem = styled.span<CellProps>`
    display: ${({ disabled }) => (disabled ? 'none' : 'inline')};
    font-size: 1.2rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 600;
    text-align: ${({ align }) => (align ? align : 'right')};
    background-color: ${({ theme }) => theme.colors.darkerBlue};
    color: white;
    cursor: pointer;

    & ::after {
        content: ${({ desktopText }) =>
            desktopText ? `"${desktopText}"` : ''};
    }

    ${({ theme }) => theme.media.small} {
        ${({ disableMobile }) => disableMobile && `display: none;`}
        & ::after {
            content: ${({ mobileText }) =>
                mobileText ? `"${mobileText}"` : ''};
        }
    }
`;

const StatItem = styled.span<CellProps>`
    display: ${({ disabled }) => (disabled ? 'none' : 'inline')};
    box-sizing: border-box;
    width: 100%;
    text-align: ${({ align }) => (align ? align : 'right')};
    background-color: ${({ darker, theme }) =>
        darker ? theme.colors.lightGray : 'inherit'};
    ${({ theme }) => theme.media.small} {
        ${({ disableMobile }) => disableMobile && `display: none;`}
    }
`;

const EncourageContainer = styled.div`
    flex: 2;
`;

const EncourageText = styled.p`
    font-weight: 600;
`;

interface DividerProps {
    allColumns: boolean;
    thick?: boolean;
}

const Divider = styled.div<DividerProps>`
    border-bottom: ${({ theme, thick }) =>
        `${thick ? 2 : 1}px solid ${theme.colors.borderGray}`};
    grid-column: 1 / ${({ allColumns }) => (allColumns ? 6 : 5)};

    ${({ theme }) => theme.media.small} {
        grid-column: 1 / 4;
    }
`;

interface Props {
    individualStats: IndividualStat[];
    stats: SchoolStat[];
}

interface State {
    individualStats: IndividualStat[];
    filteredStats: SchoolStat[];
    stats: SchoolStat[];
    selectedOption: 'all' | 'A' | 'B' | 'C' | 'individual' | 'graphs';
    sortby: 'rank' | 'name' | 'users' | 'count';
    competitionDone: boolean;
}

class Leaderboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            individualStats: [],
            filteredStats: [],
            stats: [],
            selectedOption: 'all',
            sortby: 'rank',
            competitionDone: false,
        };
    }

    statsToState = () => {
        const { individualStats, stats } = this.props;
        const usableStats = stats.filter(
            (stat) =>
                !!schools.find((school) => school.code == stat.institution)
        );
        const newStats = schools
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((school, i: number) => {
                const schoolStat = usableStats.find(
                    (stat) => stat.institution == school.code
                );
                return schoolStat
                    ? schoolStat
                    : {
                          institution: school.code,
                          count: 0,
                          users: 0,
                          rank: i + usableStats.length + 1,
                      };
            })
            .sort((a, b) => {
                const schoolA = schools.find(
                    (school) => school.code == a.institution
                );
                const schoolB = schools.find(
                    (school) => school.code == b.institution
                );
                return a.count < b.count
                    ? 1
                    : a.count == b.count
                    ? schoolA && schoolB
                        ? schoolA.name.localeCompare(schoolB.name)
                        : -1
                    : -1;
            });

        const usableIndividualStats = individualStats
            .filter(
                (stat) =>
                    !!schools.find((school) => school.code == stat.institution)
            )
            .sort((a, b) => (a.count < b.count ? 1 : -1));
        this.setState({
            individualStats: usableIndividualStats,
            filteredStats: newStats,
            stats: newStats,
        });
    };

    sort = (sortBy: 'rank' | 'name' | 'users' | 'count') => {
        if (this.state.selectedOption == 'individual') {
            return this.sortIndividuals(sortBy);
        }
        this.setState((prevState) => {
            const sortedStats = prevState.filteredStats.sort((a, b) => {
                const schoolA = schools.find(
                    (school) => school.code == a.institution
                );
                const schoolB = schools.find(
                    (school) => school.code == b.institution
                );
                switch (sortBy) {
                    case 'rank':
                    case 'count':
                        return a.count < b.count
                            ? 1
                            : a.count == b.count
                            ? schoolA && schoolB
                                ? schoolA.name.localeCompare(schoolB.name)
                                : -1
                            : -1;
                    case 'name':
                        return schoolA && schoolB
                            ? schoolA.name.localeCompare(schoolB.name)
                            : 1;
                    case 'users':
                        return a.users < b.users
                            ? 1
                            : a.users == b.users
                            ? schoolA && schoolB
                                ? schoolA.name.localeCompare(schoolB.name)
                                : -1
                            : -1;
                    default:
                        return -1;
                }
            });

            return {
                ...prevState,
                filteredStats: sortedStats,
            };
        });
    };

    sortIndividuals = (
        sortBy: 'rank' | 'name' | 'users' | 'username' | 'count'
    ) => {
        this.setState((prevState) => {
            const sortedStats = prevState.individualStats.sort((a, b) => {
                const schoolA = schools.find(
                    (school) => school.code == a.institution
                );
                const schoolB = schools.find(
                    (school) => school.code == b.institution
                );
                switch (sortBy) {
                    case 'name':
                        return schoolA && schoolB
                            ? schoolA.name.localeCompare(schoolB.name)
                            : 1;
                    case 'count':
                    case 'rank':
                        return a.count < b.count
                            ? 1
                            : a.count == b.count
                            ? schoolA && schoolB
                                ? schoolA.name.localeCompare(schoolB.name)
                                : -1
                            : -1;
                    case 'users':
                        return a.username.localeCompare(b.username);
                    default:
                        return -1;
                }
            });

            return {
                ...prevState,
                individualStats: sortedStats,
            };
        });
    };

    filterStats = (filter: string) => {
        switch (filter) {
            case 'all':
                return this.state.stats;
            case 'A':
                return this.state.stats.filter((stat) => {
                    const school = schools.find(
                        (value) => value.code == stat.institution
                    );
                    return school && school.division == 1;
                });
            case 'B':
                return this.state.stats.filter((stat) => {
                    const school = schools.find(
                        (value) => value.code == stat.institution
                    );
                    return school && school.division == 2;
                });
            case 'C':
                return this.state.stats.filter((stat) => {
                    const school = schools.find(
                        (value) => value.code == stat.institution
                    );
                    return school && school.division == 3;
                });
            case 'individual':
                return this.state.stats;
            default:
                return this.state.stats;
        }
    };

    componentDidMount = () => {
        this.isStarted();
        this.statsToState();
    };

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        const prevStats = prevProps.stats;
        const { stats } = this.props;
        if (prevStats != stats) {
            this.statsToState();
        }
        const prevFilter = prevState.selectedOption;
        if (prevFilter != this.state.selectedOption) {
            const newStats = this.filterStats(this.state.selectedOption);
            this.setState({ filteredStats: newStats });
        }
    };

    getSchoolCategory = (code: string) => {
        const school = schools.find((school) => school.code == code);
        return !school
            ? 'C'
            : school.division == 1
            ? 'A'
            : school.division == 2
            ? 'B'
            : school.division == 3
            ? 'C'
            : 'C';
    };

    getSchoolName = (code: string) => {
        const school = schools.find((school) => school.code == code);
        return school ? school.name : '';
    };

    isStarted = () => {
        return new Date() >= startTime;
    };

    shouldCreateSuspense = (): boolean => {
        return new Date() >= lastDay && new Date() <= revealResultsTime;
    };

    isFinished = (): boolean => {
        return new Date() >= endTime;
    };

    /*     getSchoolRatio = (code: string, count: number) => {
            const school = schools.find((school) => school.code == code);
            return school
                ? (count / (school.class1_3 + school.class4_10)).toFixed(1)
                : 1;
        } */

    competitionDone = () => {
        this.setState({ competitionDone: true });
    };

    revealResults = () => {
        setTimeout(() => window.location.reload(), 1000);
    };

    render() {
        const {
            individualStats,
            filteredStats,
            selectedOption,
            competitionDone,
        } = this.state;

        const createSuspense = this.shouldCreateSuspense();
        const isFinished = this.isFinished();
        return (
            <LeaderboardContainer>
                <HeaderContainer>
                    <TitleContainer doubleColumns={true}>
                        <h2>
                            {isFinished
                                ? 'Hvaða skóli las mest?'
                                : 'Hvaða skóli les mest?'}
                        </h2>
                        {!this.isStarted() ? (
                            <span>
                                Lestrarkeppni grunnskólanna hefst mánudaginn 18.
                                janúar klukkan 15:00
                            </span>
                        ) : !this.isFinished() ? (
                            this.shouldCreateSuspense() ? (
                                <EncourageContainer>
                                    <span>
                                        Lestrarkeppni grunskólanna lýkur
                                        mánudaginn 25. janúar á miðnætti.
                                    </span>
                                    <EncourageText>
                                        Frá miðnætti sunnudaginn 24. janúar
                                        verður stigataflan hulin. Keppnin er
                                        æsispennandi og úrslit munu líklegast
                                        ráðast á síðustu metrunum.
                                    </EncourageText>
                                </EncourageContainer>
                            ) : (
                                <span>
                                    Lestrarkeppni grunskólanna lýkur mánudaginn
                                    25. janúar á miðnætti
                                </span>
                            )
                        ) : this.shouldCreateSuspense() ? (
                            <span>
                                Lestrarkeppni grunnskóla lauk þann 25. janúar.
                                Úrslit verða tilkynnt við hátíðlega athöfn á
                                Bessastöðum þann 27. janúar. Fylgist með á{' '}
                                <StyledLink
                                    href={'https://www.facebook.com/samromur/'}
                                >
                                    facebook síðu Samróms
                                </StyledLink>
                            </span>
                        ) : (
                            <FinishedText>
                                <p>
                                    Lestrarkeppni grunnskóla stóð yfir 18. - 25.
                                    janúar 2021. Keppnin var hreint út sagt
                                    ótrúleg og allir sem tóku þátt eiga hrós
                                    skilið.
                                </p>
                                <p>
                                    Smá tölulegar upplýsingar, í heildina voru
                                    lesnar um 790 þúsund setningar frá 6172
                                    manns fyrir 136 skóla Verkefnið hefur staðið
                                    yfir frá því lok árs 2019 og fram að
                                    keppninni höfðum við safnað um 320 þúsund
                                    setningum. Það gerir um 131 setningu á hvern
                                    þátttakanda en raunin var að tugir keppenda
                                    lásu þúsundir setninga.
                                </p>
                                <p>
                                    Veitt voru verðlaun til skólanna sem voru í
                                    fyrsta sæti í sínum flokki, auk þess að þeir
                                    skólar sem lásu mest þvert á flokka þar á
                                    eftir fengu viðkenningu fyrir frábæran
                                    árangur. Skólarnir sem sigruðu sína flokka
                                    voru Setbergsskóli, Smáraskóli og
                                    Grenivíkurskóli. Skólarnir sem fengur
                                    viðkenningu fyrir framúrskarandi árangur
                                    voru Höfðaskóli, Gerðaskóli og
                                    Myllubakkaskóli.
                                </p>
                            </FinishedText>
                        )}
                        <span></span>
                        <StyledLink href={'/grunnskolakeppni#um'}>
                            Lesa meira um keppnina
                        </StyledLink>
                    </TitleContainer>

                    {!createSuspense && (
                        <TabSelector>
                            <CategoryTitle>Flokkur</CategoryTitle>
                            <Tab
                                onClick={() =>
                                    this.setState({ selectedOption: 'all' })
                                }
                                selected={selectedOption === 'all'}
                            >
                                Allir
                            </Tab>
                            <Tab
                                onClick={() =>
                                    this.setState({ selectedOption: 'A' })
                                }
                                selected={selectedOption === 'A'}
                            >
                                A
                            </Tab>
                            <Tab
                                onClick={() =>
                                    this.setState({ selectedOption: 'B' })
                                }
                                selected={selectedOption === 'B'}
                            >
                                B
                            </Tab>
                            <Tab
                                onClick={() =>
                                    this.setState({ selectedOption: 'C' })
                                }
                                selected={selectedOption === 'C'}
                            >
                                C
                            </Tab>
                            <Tab
                                onClick={() =>
                                    this.setState({
                                        selectedOption: 'individual',
                                    })
                                }
                                selected={selectedOption === 'individual'}
                            >
                                Einstaklingar
                            </Tab>

                            <Tab
                                onClick={() =>
                                    this.setState({
                                        selectedOption: 'graphs',
                                    })
                                }
                                selected={selectedOption === 'graphs'}
                            >
                                Línurit
                            </Tab>
                        </TabSelector>
                    )}
                </HeaderContainer>
                {createSuspense ? (
                    <div>
                        {!isFinished ? (
                            <CountDownContainer>
                                <span>{'Tími sem eftir er af keppninni'}</span>
                                <StyledCountDown
                                    date={endTime}
                                    onComplete={this.competitionDone}
                                    daysInHours
                                />
                            </CountDownContainer>
                        ) : (
                            <CountDownContainer>
                                <span>
                                    {'Tími þar til niðurstöðurnar verða birtar'}
                                </span>
                                <StyledCountDown
                                    date={revealResultsTime}
                                    onComplete={this.revealResults}
                                    daysInHours
                                />
                            </CountDownContainer>
                        )}
                        <StyledImage src="./images/leaderboard_blurred.png" />
                    </div>
                ) : selectedOption !== 'graphs' ? (
                    <div>
                        <SubTitle>
                            <h3>Stigatafla</h3>
                            {selectedOption == 'individual' && (
                                <StyledLink href={'/minar-sidur'}>
                                    <ConditionalMobileText
                                        desktop={
                                            'Með því að búa til aðgang má halda utan um einstaklings árangur'
                                        }
                                        mobile={'Búa til aðang'}
                                    />
                                    {/* Með því að búa til aðgang má halda utan um einstaklings árangur */}
                                </StyledLink>
                            )}
                        </SubTitle>
                        <LeaderboardContent
                            allColumns={selectedOption == 'all'}
                            createSuspense={!competitionDone && createSuspense}
                        >
                            <HeaderItem
                                align="left"
                                thick
                                onClick={() => this.sort('rank')}
                            >
                                *
                            </HeaderItem>
                            <HeaderItem
                                disableMobile={selectedOption == 'individual'}
                                align="left"
                                onClick={() => this.sort('name')}
                            >
                                Skóli
                            </HeaderItem>
                            <HeaderItem
                                disabled={selectedOption != 'all'}
                                disableMobile
                            >
                                Flokkur
                            </HeaderItem>
                            <HeaderItem
                                disableMobile={selectedOption != 'individual'}
                                align="left"
                                onClick={() => this.sort('users')}
                            >
                                {selectedOption == 'individual'
                                    ? 'Keppandi'
                                    : 'Keppendur'}
                            </HeaderItem>
                            <HeaderItem onClick={() => this.sort('count')}>
                                Setningar
                            </HeaderItem>
                            <Divider allColumns={selectedOption == 'all'} />
                            {selectedOption == 'individual'
                                ? individualStats.map(
                                      (stat: IndividualStat, i: number) => (
                                          <React.Fragment key={i}>
                                              <StatItem
                                                  align="left"
                                                  darker={i % 2 != 0}
                                              >
                                                  {i + 1}
                                              </StatItem>
                                              <StatItem
                                                  disableMobile
                                                  align="left"
                                                  darker={i % 2 != 0}
                                              >
                                                  {this.getSchoolName(
                                                      stat.institution
                                                  )}
                                              </StatItem>
                                              <StatItem
                                                  align="left"
                                                  darker={i % 2 != 0}
                                              >
                                                  {stat.username}
                                              </StatItem>
                                              <StatItem darker={i % 2 != 0}>
                                                  {stat.count}
                                              </StatItem>
                                              {i !=
                                                  individualStats.length -
                                                      1 && (
                                                  <Divider allColumns={false} />
                                              )}
                                          </React.Fragment>
                                      )
                                  )
                                : filteredStats.map(
                                      (stat: SchoolStat, i: number) => (
                                          <React.Fragment key={i}>
                                              <StatItem
                                                  align="left"
                                                  darker={i % 2 != 0}
                                              >
                                                  {i + 1}
                                              </StatItem>
                                              <StatItem
                                                  align="left"
                                                  darker={i % 2 != 0}
                                              >
                                                  {this.getSchoolName(
                                                      stat.institution
                                                  )}
                                              </StatItem>
                                              <StatItem
                                                  disabled={
                                                      selectedOption != 'all'
                                                  }
                                                  disableMobile
                                                  align="right"
                                                  darker={i % 2 != 0}
                                              >
                                                  {this.getSchoolCategory(
                                                      stat.institution
                                                  )}
                                              </StatItem>
                                              <StatItem
                                                  disableMobile
                                                  darker={i % 2 != 0}
                                              >
                                                  {stat.users}
                                              </StatItem>
                                              <StatItem darker={i % 2 != 0}>
                                                  {stat.count}
                                              </StatItem>
                                              {i !=
                                                  filteredStats.length - 1 && (
                                                  <Divider
                                                      allColumns={
                                                          selectedOption ==
                                                          'all'
                                                      }
                                                  />
                                              )}
                                          </React.Fragment>
                                      )
                                  )}
                        </LeaderboardContent>
                    </div>
                ) : (
                    <div>
                        <CompetitionGenderChart
                            chartData={competitionGenderStats}
                        />
                        <CompetitionAgeChart chartData={competitionAgeStats} />
                        <CompetitionTimeLineChart
                            chartData={competitionTimeline}
                        />
                    </div>
                )}
            </LeaderboardContainer>
        );
    }
}

export default Leaderboard;
