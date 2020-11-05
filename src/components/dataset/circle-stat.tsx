import * as React from 'react';
import styled from 'styled-components';

interface ContainerProps {
    color: string;
}

const CircleStatContainer = styled.div<ContainerProps>`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 6fr 2fr;
    border-bottom: 2px solid ${({ color, theme }) => theme.colors[color]};
    gap: 0.5rem;
    max-height: 6rem;
    padding-bottom: 1rem;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto 0;

    & span {
        margin-bottom: 0.6rem;
    }

    & h2 {
        font-weight: 900;
    }
`;

const Dots = styled.div`
    background: linear-gradient(90deg, white 8.5px, transparent 1%) center,
        linear-gradient(white 8.5px, transparent 1%) center, #cbcbcb;
    background-size: 10px 10px;
`;

const CircleContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Circle = styled.div<ContainerProps>`
    border: 8px solid ${({ color, theme }) => theme.colors[color]};
    border-radius: 50%;
    height: 5rem;
    width: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface Props {
    color: string;
    icon: React.ReactNode;
    label: string;
    value: string;
}

export const CircleStat: React.FunctionComponent<Props> = ({
    color,
    icon,
    label,
    value,
}) => {
    return (
        <CircleStatContainer color={color}>
            <Dots />
            <TextContainer>
                <span>{label}</span>
                <h2>{value}</h2>
            </TextContainer>
            <CircleContainer>
                <Circle color={color}>{icon}</Circle>
            </CircleContainer>
        </CircleStatContainer>
    );
};

export default CircleStat;
