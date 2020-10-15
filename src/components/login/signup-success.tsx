import * as React from 'react';
import styled from 'styled-components';

const SignupSuccessContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem auto;
    max-width: 40rem;
    gap: 1.5rem;
`;

const Paragraph = styled.p`
    & span {
        font-weight: 600;
    }
    margin: 0;
`;

const Title = styled.h3`

`

const Button = styled.div`
    border: none;
    display: flex;
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.blue};
    color: white;
    cursor: pointer;

    :active {
        transform: translateY(2px);
    }

`;

interface Props {
    email: string;
}

export const SignupSuccess: React.FunctionComponent<Props> = ({ email }) => {
    const handleClick = () => {
        window.location.reload();
    }
    return (
        <SignupSuccessContainer>
            <Title>Nýskráning tókst</Title>
            <Paragraph>
                Tölvupóstur hefur verið sendur á netfangið <span>{email || 'olli.jonsson@gmail.com'}</span>
            </Paragraph>
            <Paragraph>
                Smelltu á hlekkinn í póstinum til þess að klára nýskráningu.
            </Paragraph>
            <Button onClick={handleClick}>
                Innskrá
            </Button>
        </SignupSuccessContainer>
    );
}

export default SignupSuccess;