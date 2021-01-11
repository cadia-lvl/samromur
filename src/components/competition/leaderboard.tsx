import * as React from 'react';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 50rem;
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
    background-color: ${({ selected, theme }) => selected ? '#EBEBEB' : 'inherit'};
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    cursor: pointer;
    transition: 0.3s;
`;

const LeaderboardContent = styled.div`
    display: grid;
    grid-template-columns: 3rem auto 1fr 1fr 1fr;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    & span {
        padding: 0.5rem 1rem;
    }
`;

interface CellProps {
    align?: string;
    thick?: boolean;
    darker?: boolean;
}

const HeaderItem = styled.span<CellProps>`
    font-size: 1.2rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 600;
    text-align: ${({ align }) => align ? align : 'right'};
    background-color: ${({ theme }) => theme.colors.darkerBlue};
    color: white;
`;

const StatItem = styled.span<CellProps>`
    text-align: ${({ align }) => align ? align : 'right'};
    background-color: ${({ darker, theme }) => darker ? theme.colors.lightGray : 'inherit'};
`;

interface DividerProps {
    thick?: boolean;
}

const Divider = styled.div<DividerProps>`
    border-bottom: ${({ theme, thick }) => `${thick ? 2 : 1}px solid ${theme.colors.borderGray}`};
    grid-column: 1 / 6;
`;

import { SchoolStat } from '../../types/competition';

interface Props {
    stats: SchoolStat[];
}

interface State {
    selectedOption: 'all' | '1' | '2' | '3' | 'individual';
}

class Leaderboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedOption: 'all',
        }
    };

    render() {
        const { stats } = this.props;
        const { selectedOption } = this.state;
        return (
            <LeaderboardContainer>
                <TabSelector>
                <CategoryTitle>
                    Flokkur
                </CategoryTitle>
                    <Tab
                        onClick={() => this.setState({ selectedOption: 'all' })}
                        selected={selectedOption === 'all'}>Allt</Tab>
                    <Tab
                        onClick={() => this.setState({ selectedOption: '1' })}
                        selected={selectedOption === '1'}>1</Tab>
                    <Tab
                        onClick={() => this.setState({ selectedOption: '2' })}
                        selected={selectedOption === '2'}>2</Tab>
                    <Tab
                        onClick={() => this.setState({ selectedOption: '3' })}
                        selected={selectedOption === '3'}>3</Tab>
                    <Tab
                        onClick={() => this.setState({ selectedOption: 'individual' })}
                        selected={selectedOption === 'individual'}>Einstaklingar</Tab>
                </TabSelector>
                <LeaderboardContent>
                    <HeaderItem align='left' thick>*</HeaderItem>
                    <HeaderItem align='left'>Skóli</HeaderItem>
                    <HeaderItem>Keppendur</HeaderItem>
                    <HeaderItem>Hlutfall</HeaderItem>
                    <HeaderItem>Setningar</HeaderItem>
                    <Divider />
                    {
                        stats.map((stat: SchoolStat, i: number) =>
                            <React.Fragment key={i}>
                                <StatItem align='left'>{stat.rank}</StatItem>
                                <StatItem align='left' darker={i % 2 != 0}>{stat.institution}</StatItem>
                                <StatItem darker={i % 2 != 0}>{stat.users}</StatItem>
                                <StatItem darker={i % 2 != 0}>{1}</StatItem>
                                <StatItem darker={i % 2 != 0}>{stat.count}</StatItem>
                                {i != stats.length - 1 && (
                                    <Divider />
                                )}
                            </React.Fragment>
                        )}
                </LeaderboardContent>
            </LeaderboardContainer >
        )
    }
}

export default Leaderboard;