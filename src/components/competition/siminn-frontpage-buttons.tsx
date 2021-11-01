import { useRouter } from 'next/router';
import * as React from 'react';
import styled from 'styled-components';
import PrimaryButton from './ui/comp-button-primary';

// import SecondaryButton from "./ui/comp-button-primary"

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const SiminnCompetitionButtons: React.FC = () => {
    const router = useRouter();

    return (
        <ButtonsContainer>
            <PrimaryButton onClick={() => router.push('/tala')}>
                Taka þátt
            </PrimaryButton>
            <PrimaryButton onClick={() => router.push('/skra')}>
                Skrá
            </PrimaryButton>
            <PrimaryButton onClick={() => router.push('/siminn-keppni')}>
                Stigatafla
            </PrimaryButton>
        </ButtonsContainer>
    );
};

export default SiminnCompetitionButtons;
