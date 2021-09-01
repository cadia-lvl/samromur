import * as React from 'react';
import styled from 'styled-components';
import { Goal } from '../../../types/contribute';

const CardContainer = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 1rem;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    cursor: pointer;

    & :hover,
    :active {
        background-color: ${({ theme }) => theme.colors.green};
        color: white;
    }

    & :active {
        transform: translateY(2px);
    }
`;

interface Props {
    goal: Goal;
    setGoal: (goal: Goal) => void;
}

export const PackageCard: React.FunctionComponent<Props> = ({
    goal,
    setGoal,
}) => {
    return (
        <CardContainer onClick={() => setGoal(goal)}>
            <h3>{goal.name}</h3>
            <p>{goal.text}</p>
        </CardContainer>
    );
};

export default PackageCard;
