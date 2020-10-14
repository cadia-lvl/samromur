import * as React from 'react';
import styled from 'styled-components';
import PackageCard from './package-card';
import { listenGoals, speakGoals } from '../../../constants/packages';
import { Goal } from '../../../types/contribute';

const CardGrid = styled.div`
    min-width: 80%;
    display: grid;
    text-align: center;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    ${({ theme }) => theme.media.small} {
        min-width: 100%;
        grid-template-columns: 100%;
        grid-template-rows: auto;
    }
`;

interface Props {
    contributeType: string;
    setGoal: (goal: Goal) => void;
}

export const TypeSelect: React.FunctionComponent<Props> = ({ contributeType, setGoal }) => {
    return (
        <CardGrid>
            {
                contributeType == 'hlusta'
                    ?
                    listenGoals.map((goal: Goal, i: number) => <PackageCard goal={goal} key={i} setGoal={setGoal} />)
                    :
                    speakGoals.map((goal: Goal, i: number) => <PackageCard goal={goal} key={i} setGoal={setGoal} />)
            }
        </CardGrid>
    );
}

export default TypeSelect;