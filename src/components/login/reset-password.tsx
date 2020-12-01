import * as React from 'react';
import styled from 'styled-components';
import TextInput from '../ui/input/text';
import { FormError } from '../../types/auth';

const ForgotPasswordContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem auto;
    max-width: 30rem;
`;

const ErrorContainer = styled.div`
    color: ${({ theme }) => theme.colors.red};
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const Title = styled.h3`
    margin-bottom: 2rem;
`;

const Button = styled.div`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.blue};
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    font-size: 1.2rem;
    font-weight: 600;
    justify-content: center;
    max-width: 30rem;
    margin: 0 auto;
    padding: 1rem 2rem;
    width: 100%;

    :active {
        transform: translateY(2px);
    }
`;

interface Props {
    token: string;
}

interface State {
    password: string;
    passwordAgain: string;
    error?: FormError;
}

class ResetPassword extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            password: '',
            passwordAgain: '',
            error: undefined,
        };
    }

    // TODO: on mount, validate token, if invalid, redirect to 404

    handleResetPassword = () => {
        const error = this.validatePassword();
        if (error) {
            this.setState({ error });
        } else {
            // TO-DO: send api request
            // on success print success message
            // show link to login
        }
    };

    validatePassword = (): FormError | null => {
        const { password, passwordAgain } = this.state;
        if (password == '') {
            return FormError.MISSING_PASSWORD;
        } else if (passwordAgain == '') {
            return FormError.MISSING_PASSWORD_AGAIN;
        } else if (password !== passwordAgain) {
            return FormError.PASSWORD_MISMATCH;
        }
        return null;
    };

    onPasswordChange = (password: string) => {
        this.setState({ password });
        this.clearError();
    };

    onPasswordAgainChange = (passwordAgain: string) => {
        this.setState({ passwordAgain });
        this.clearError();
    };

    clearError = () => {
        this.setState({ error: undefined });
    };

    getErrorMessage = (): string => {
        const { error } = this.state;
        switch (error) {
            case FormError.MISSING_PASSWORD:
                return 'Lykilorð vantar';
            case FormError.MISSING_PASSWORD_AGAIN:
                return 'Það þarf að staðfesta lykilorð';
            case FormError.PASSWORD_MISMATCH:
                return 'Lykilorð verða að stemma';
            default:
                return 'óþekkt villa';
        }
    };
    render() {
        const { error } = this.state;
        return (
            <ForgotPasswordContainer>
                <Title>Endur stilla lykilorð</Title>
                <TextInput
                    label="Lykilorð"
                    onChange={this.onPasswordChange}
                    placeholder=""
                    type="password"
                />
                <TextInput
                    label="Lykilorð aftur"
                    onChange={this.onPasswordAgainChange}
                    placeholder=""
                    type="password"
                />
                {error && (
                    <ErrorContainer>{this.getErrorMessage()}</ErrorContainer>
                )}
                <Button onClick={this.handleResetPassword}>
                    Reset password.
                </Button>
            </ForgotPasswordContainer>
        );
    }
}

export default ResetPassword;
