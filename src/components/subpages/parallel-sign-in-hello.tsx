import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';

const Container = styled.div`
    padding-bottom: 2rem;
`;

const SignInContainer = styled.div``;

interface Props {
    switchUser: () => void;
}

export const ParallelSignInHello: React.FC<Props> = (props) => {
    const {
        client: { isAuthenticated, username },
    } = useSelector((state: RootState) => state.user);

    return (
        <Container>
            <SignInContainer>
                Vinsamlegast skráðu þig inn til að taka þátt.
                <br></br>
                <Link href={'/innskraning'} passHref>
                    <StyledLink>
                        Smelltu hér til að skrá þig inn eða búa til aðgang.
                    </StyledLink>
                </Link>
            </SignInContainer>
        </Container>
    );
};