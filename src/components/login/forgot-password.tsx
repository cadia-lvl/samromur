import * as React from 'react';
import styled from 'styled-components';
import TextInput from '../ui/input/text';
import * as authApi from '../../services/auth-api';
import validateEmail from '../../utilities/validate-email';
import { FormError } from '../../types/auth';

const ForgotPasswordContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem auto;
    max-width: 30rem;
`;

const Paragraph = styled.p`
    & span {
        font-weight: 600;
    }
    margin: 0;
`;

const ErrorContainer = styled.div`
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.red};
`;

const Title = styled.h3`
    margin-bottom: 2rem;
`;

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

interface Props {}

interface State {
    email: string;
    resetEmailSent: boolean;
    formError?: FormError;
}

class ForgotPassword extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            resetEmailSent: false,
            formError: undefined,
        };
    }

    /**
     * Sends the api request to send the reset link email
     * to start the password recovery process.
     * If the email is invalid, the formerror state is updated.
     */
    handleResetPassword = () => {
        const { email } = this.state;
        if (validateEmail(email)) {
            authApi.createResetToken(email);
            this.setState({ resetEmailSent: true });
            this.setState({ formError: undefined });
        } else {
            this.setState({ formError: FormError.INVALID_EMAIL });
        }
    };

    onEmailChange = (email: string) => {
        this.setState({ email });
    };
    render() {
        const { resetEmailSent, email, formError: validEmail } = this.state;
        return (
            <ForgotPasswordContainer>
                <Title>Týnt lykilorð</Title>
                {!resetEmailSent ? (
                    <div>
                        <TextInput
                            label="Tölvupóstfang"
                            onChange={this.onEmailChange}
                            placeholder=""
                        />
                        {validEmail && (
                            <ErrorContainer>Ógilt tölvupóstfang</ErrorContainer>
                        )}
                        <Button onClick={this.handleResetPassword}>
                            Staðfesta
                        </Button>
                    </div>
                ) : (
                    <Paragraph>
                        Tölvupóstur með leiðbeiningum um hvernig á að
                        endurstilla lykilorðið þitt hefur verið sendur til{' '}
                        {email}
                    </Paragraph>
                )}
            </ForgotPasswordContainer>
        );
    }
}

export default ForgotPassword;
