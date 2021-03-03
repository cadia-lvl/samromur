import * as React from 'react';
import styled from 'styled-components';
import PackageCard from './package-card';
import {
    listenGoals,
    repeatGoals,
    speakGoals,
} from '../../../constants/packages';
import { ContributeType, Goal } from '../../../types/contribute';

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

export const TypeSelect: React.FunctionComponent<Props> = ({
    contributeType,
    setGoal,
}) => {
    return (
        <CardGrid>
            {contributeType == ContributeType.LISTEN
                ? listenGoals.map((goal: Goal, i: number) => (
                      <PackageCard goal={goal} key={i} setGoal={setGoal} />
                  ))
                : contributeType == ContributeType.SPEAK
                ? speakGoals.map((goal: Goal, i: number) => (
                      <PackageCard goal={goal} key={i} setGoal={setGoal} />
                  ))
                : repeatGoals.map((goal: Goal, i: number) => (
                      <PackageCard goal={goal} key={i} setGoal={setGoal} />
                  ))}
        </CardGrid>
    );
};

export default TypeSelect;
