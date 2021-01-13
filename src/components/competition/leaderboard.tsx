import * as React from 'react';
import styled from 'styled-components';

import { schools } from '../../constants/schools';

import { IndividualStat, SchoolStat } from '../../types/competition';

const LeaderboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 50rem;
    margin: 0 auto;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    ${({ theme }) => theme.media.small} {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;

    & a {
        margin-top: 0.5rem;
        text-align: right;
    }
`;

const CategoryTitle = styled.span`
    grid-column: 1 / 6;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.darkerBlue};
    color: white;
`;

const TabSelector = styled.div`
    display: grid;
    grid-template-columns: repeat(5, min-content);
    //border: 1px solid ${({ theme }) => theme.colors.borderGray};
    margin-bottom: 1.5rem;
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
`;

const LeaderboardContent = styled.div`
    display: grid;
    grid-template-columns: 3rem 60% 1fr 1fr;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    & span {
        padding: 0.5rem 1rem;
    }

    
    ${({ theme }) => theme.media.small} {
        grid-template-columns: 3rem 60% 1fr;
    }
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
`;

interface CellProps {
    align?: string;
    thick?: boolean;
    darker?: boolean;
    disableMobile?: boolean;
}

const HeaderItem = styled.span<CellProps>`
    font-size: 1.2rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 600;
    text-align: ${({ align }) => (align ? align : 'right')};
    background-color: ${({ theme }) => theme.colors.darkerBlue};
    color: white;
    cursor: pointer;
    ${({ theme }) => theme.media.small} {
        ${({ disableMobile }) => disableMobile && `display: none;`}
    }
`;

const StatItem = styled.span<CellProps>`
    text-align: ${({ align }) => (align ? align : 'right')};
    background-color: ${({ darker, theme }) =>
        darker ? theme.colors.lightGray : 'inherit'};
        ${({ theme }) => theme.media.small} {
            ${({ disableMobile }) => disableMobile && `display: none;`}
        }
`;

interface DividerProps {
    thick?: boolean;
}

const Divider = styled.div<DividerProps>`
    border-bottom: ${({ theme, thick }) =>
        `${thick ? 2 : 1}px solid ${theme.colors.borderGray}`};
    grid-column: 1 / 6;
`;

interface Props {
    individualStats: IndividualStat[];
    stats: SchoolStat[];
}

interface State {
    individualStats: IndividualStat[];
    filteredStats: SchoolStat[];
    stats: SchoolStat[];
    selectedOption: 'all' | '1' | '2' | '3' | 'individual';
    sortby: 'rank' | 'name' | 'users' | 'count';
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
        };
    }

    statsToState = () => {
        const { individualStats, stats } = this.props;
        const usableStats = stats.filter(
            (stat) => !!schools.find((school) => school.code == stat.institution)
        );
        const newStats = schools.sort((a, b) => a.name.localeCompare(b.name)).map((school, i: number) => {
            const schoolStat = usableStats.find((stat) => stat.institution == school.code);
            return schoolStat ? schoolStat : {
                institution: school.code,
                count: 0,
                users: 0,
                rank: i + usableStats.length + 1,
            }
        }).sort((a, b) => a.rank < b.rank ? -1 : 1);

        const usableIndividualStats = individualStats.filter(
            (stat) => !!schools.find((school) => school.code == stat.institution)
        );
        this.setState({
            individualStats: usableIndividualStats,
            filteredStats: newStats,
            stats: newStats
        });
    }

    sort = (sortBy: 'rank' | 'name' | 'users' | 'count') => {
        this.setState((prevState) => {
            const sortedStats = prevState.filteredStats.sort((a, b) => {
                switch (sortBy) {
                    case 'rank':
                        return a.rank < b.rank ? -1 : 1;
                    case 'name':
                        const schoolA = schools.find((school) => school.code == a.institution);
                        const schoolB = schools.find((school) => school.code == b.institution);
                        return schoolA && schoolB ? schoolA.name.localeCompare(schoolB.name) : 1;
                    case 'users':
                        return a.users < b.users ? 1 : -1;
                    case 'count':
                        console.log('hæ');
                        return a.count < b.count ? 1 : -1;
                }
            });

            return {
                ...prevState,
                filteredStats: sortedStats
            }
        });
    }

    filterStats = (filter: string) => {
        switch (filter) {
            case 'all':
                return this.state.stats;
            case '1':
                return this.state.stats.filter(
                    (stat) => {
                        const school = schools.find((value) => value.code == stat.institution);
                        return school && school.division == 1;
                    }
                );
            case '2':
                return this.state.stats.filter(
                    (stat) => {
                        const school = schools.find((value) => value.code == stat.institution);
                        return school && school.division == 2;
                    }
                );
            case '3':
                return this.state.stats.filter(
                    (stat) => {
                        const school = schools.find((value) => value.code == stat.institution);
                        return school && school.division == 3;
                    }
                );
            case 'individual':
                return this.state.stats;
            default:
                return this.state.stats;
        }
    }

    componentDidMount = () => this.statsToState();

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
    }

    getSchoolName = (code: string) => {
        const school = schools.find((school) => school.code == code);
        return school ? school.name : '';
    }

    /*     getSchoolRatio = (code: string, count: number) => {
            const school = schools.find((school) => school.code == code);
            return school
                ? (count / (school.class1_3 + school.class4_10)).toFixed(1)
                : 1;
        } */

    render() {
        const { individualStats, filteredStats, selectedOption } = this.state;
        return (
            <LeaderboardContainer>
                <HeaderContainer>
                    <TitleContainer>
                        <h2>Hvaða skóli les mest?</h2>
                        <span>Lestrarkeppni grunnskólanna 18.-25.janúar</span>
                        <StyledLink href={'/grunnskolakeppni#um'}>
                            Lesa meira um keppnina
                        </StyledLink>
                    </TitleContainer>

                    <TabSelector>
                        <CategoryTitle>Flokkur</CategoryTitle>
                        <Tab
                            onClick={() => this.setState({ selectedOption: 'all' })}
                            selected={selectedOption === 'all'}
                        >
                            Allir
                    </Tab>
                        <Tab
                            onClick={() => this.setState({ selectedOption: '1' })}
                            selected={selectedOption === '1'}
                        >
                            1
                    </Tab>
                        <Tab
                            onClick={() => this.setState({ selectedOption: '2' })}
                            selected={selectedOption === '2'}
                        >
                            2
                    </Tab>
                        <Tab
                            onClick={() => this.setState({ selectedOption: '3' })}
                            selected={selectedOption === '3'}
                        >
                            3
                    </Tab>
                        <Tab
                            onClick={() => this.setState({ selectedOption: 'individual' })}
                            selected={selectedOption === 'individual'}
                        >
                            Einstaklingar
                    </Tab>
                    </TabSelector>
                </HeaderContainer>
                <h3>Stigatafla</h3>
                <LeaderboardContent>
                    <HeaderItem align="left" thick onClick={() => this.sort('rank')}>
                        *
                    </HeaderItem>
                    <HeaderItem align="left" onClick={() => this.sort('name')}>Skóli</HeaderItem>
                    <HeaderItem disableMobile onClick={() => this.sort('users')}>{selectedOption == 'individual' ? 'Keppandi' : 'Keppendur'}</HeaderItem>
                    <HeaderItem onClick={() => this.sort('count')}>Setningar</HeaderItem>
                    <Divider />
                    {
                        selectedOption == 'individual'
                            ? individualStats.map((stat: IndividualStat, i: number) => (
                                <React.Fragment key={i}>
                                    <StatItem align="left" darker={i % 2 != 0}>{i + 1}</StatItem>
                                    <StatItem align="left" darker={i % 2 != 0}>
                                        {this.getSchoolName(stat.institution)}
                                    </StatItem>
                                    <StatItem disableMobile darker={i % 2 != 0}>
                                        {stat.username}
                                    </StatItem>
                                    <StatItem darker={i % 2 != 0}>
                                        {stat.count}
                                    </StatItem>
                                    {i != individualStats.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                            : filteredStats.map((stat: SchoolStat, i: number) => (
                                <React.Fragment key={i}>
                                    <StatItem align="left" darker={i % 2 != 0}>{i + 1}</StatItem>
                                    <StatItem align="left" darker={i % 2 != 0}>
                                        {this.getSchoolName(stat.institution)}
                                    </StatItem>
                                    <StatItem disableMobile darker={i % 2 != 0}>
                                        {stat.users}
                                    </StatItem>
                                    <StatItem darker={i % 2 != 0}>
                                        {stat.count}
                                    </StatItem>
                                    {i != filteredStats.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                    }
                </LeaderboardContent>
            </LeaderboardContainer>
        );
    }
}

export default Leaderboard;
