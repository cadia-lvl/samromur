import * as React from 'react';
import styled from 'styled-components';
import * as colors from './colors';
import ReddumMalinuLogo from '../../ui/logos/reddum-malinu';
import { useRouter } from 'next/router';

const TitleContainer = styled.div`
    margin-bottom: 4rem;
    min-width: 20rem;
`;

const LinkButton = styled.div`
    cursor: pointer;
`;

export const ReddumTitle: React.FC = () => {
    const router = useRouter();

    return (
        <TitleContainer>
            <LinkButton
                onClick={() => {
                    router.push('/');
                }}
            >
                <ReddumMalinuLogo fill={colors.blue2} />
            </LinkButton>
        </TitleContainer>
    );
};
