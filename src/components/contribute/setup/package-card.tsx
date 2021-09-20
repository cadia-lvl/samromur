import { TFunction } from 'next-i18next';
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../../server/i18n';
import { ContributeType, Goal } from '../../../types/contribute';

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
    const { t } = useTranslation('contribute');

    return (
        <CardContainer onClick={() => setGoal(goal)}>
            <h3>{t(goal.name)}</h3>
            <p>{t(goal.text, { number: goal.count })}</p>
        </CardContainer>
    );
};

export default PackageCard;
