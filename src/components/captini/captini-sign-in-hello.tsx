import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';

const Container = styled.div`
    padding-top: 5rem;
`;

const SignInContainer = styled.div``;

const HelloContainer = styled.div``;

const TextButton = styled.div`
    color: ${({ theme }) => theme.colors.blue};
    :focus {
        color: ${({ theme }) => theme.colors.blue};
    }

    :hover {
        color: ${({ theme }) => theme.colors.blackOlive};
    }
    cursor: pointer;
`;

interface Props {
    switchUser: () => void;
}

export const CaptiniSignInHello: React.FC<Props> = (props) => {
    const {
        client: { isAuthenticated, username },
    } = useSelector((state: RootState) => state.user);

    return (
        <Container>
            {isAuthenticated ? (
                <HelloContainer>
                    {username ? (
                        <>
                            <p>
                                Goðan daginn {username},<br />
                                Takk fyrir aðstoðina við CAPTinI safnið!
                                <br />
                            </p>
                            <p>
                                Ertu ekki {username}? <br />
                                <TextButton onClick={props.switchUser}>
                                    Smelltu hér til að skipta um notanda
                                </TextButton>
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                Goðan daginn,
                                <br />
                                Þú ert skráður inn en ert ekki með notendanafn,
                                það er allt í góðu lagi.
                            </p>
                            <p>Takk fyrir aðstoðina við CAPTinI safnið!</p>
                        </>
                    )}
                </HelloContainer>
            ) : (
                <SignInContainer>
                    Þú ert ekki skráður inn.
                    <br></br>
                    <Link href={'/innskraning'} passHref>
                        <StyledLink>
                            Smelltu hér til að skrá þig inn.
                        </StyledLink>
                    </Link>
                </SignInContainer>
            )}
        </Container>
    );
};
