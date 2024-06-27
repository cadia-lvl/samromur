import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';

const Container = styled.div`
    padding-bottom: 2rem;
`;

const HelloContainer = styled.div``;

interface Props {
    switchUser: () => void;
}

export const L2SignInHello: React.FC<Props> = (props) => {
    const {
        client: { isAuthenticated, username },
    } = useSelector((state: RootState) => state.user);

    return (
        <Container>
            {isAuthenticated ? (
                <HelloContainer>
                </HelloContainer>
            ) : (
                <HelloContainer>
                    Þú getur fylgst með framvindu þinni með því að búa til aðgang.
                    <br></br>
                    <Link href={'/innskraning'} passHref>
                        <StyledLink>
                            Smelltu hér til að skrá þig inn eða búa til aðgang.
                        </StyledLink>
                    </Link>
                </HelloContainer>
            )}
        </Container>
    );
};