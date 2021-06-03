import * as React from 'react';
import styled from 'styled-components';
import PlayIcon from '../../ui/icons/play';

const CardGrid = styled.div`
    min-width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    ${({ theme }) => theme.media.small} {
        min-width: 100%;
        grid-template-columns: 100%;
        grid-template-rows: auto;
    }
`;

interface CardContainerProps {
    wide?: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
    display: grid;
    grid-template-columns: 2.5rem auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.8rem 1rem;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    cursor: pointer;

    & :active {
        transform: translateY(2px);
    }

    ${({ theme }) => theme.media.smallUp} {
        ${({ wide }) => wide && `grid-column: 1 / 3;`}
    }
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;

    & h3 {
        color: ${({ theme }) => theme.colors.blackOlive};
        margin: 0;
    }

    & p {
        margin: 0;
    }
`;

interface Props {
    labels: string[];
    setLabel: (label: string) => void;
}

export const BatchSelect: React.FunctionComponent<Props> = (props) => {
    const { labels, setLabel } = props;
    // Add samromur to labels if not existing
    const fullLabels = labels.some((label) => label === 'samromur')
        ? labels
        : ['samromur', ...labels];

    return (
        <CardGrid>
            {fullLabels.map((label: string, i: number) => (
                <CardContainer key={i} onClick={() => setLabel(label)}>
                    <PlayIcon height={40} width={40} fill={'gray'} />
                    <Title>
                        <h3>{label == 'samromur' ? 'Almennt' : label}</h3>
                    </Title>
                </CardContainer>
            ))}
        </CardGrid>
    );
};

export default BatchSelect;
