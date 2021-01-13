import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import TextInput from '../ui/input/text';
import { Button } from '../ui/buttons';

import { AuthError, AuthRequest, FormError } from '../../types/auth';

import validateEmail from '../../utilities/validate-email';

const LoginFormContainer = styled.form`
    margin: 1rem auto;
    max-width: 30rem;
    display: flex;
    flex-direction: column;
`;

const ErrorContainer = styled.div`
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.red};
`;

const ForgotAndSignupContainer = styled.div`
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 50% 50%;
`;

const Title = styled.h3`
    margin-bottom: 2rem;
`;

interface Props {
    error?: AuthError;
    onSubmit: (auth: AuthRequest, isSignup: boolean) => void;
    removeError: () => void;
}

interface State {
    email: string;
    username: string;
    formError?: FormError;
    isSignup: boolean;
    password: string;
    passwordAgain: string;
}

class LoginForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            formError: undefined,
            isSignup: false,
            password: '',
            passwordAgain: '',
        };
    }

    cleanErrors = () => {
        this.setState({ formError: undefined });
        this.props.removeError();
    };

    onEmailChange = (email: string) => {
        this.setState({ email });
        this.cleanErrors();
    };

    onUserNameChange = (userName: string) => {
        this.setState({ username: userName });
        this.cleanErrors();
    };

    onPasswordChange = (password: string) => {
        this.setState({ password });
        this.cleanErrors();
    };

    onPasswordAgainChange = (passwordAgain: string) => {
        this.setState({ passwordAgain });
        this.cleanErrors();
    };

    handleSignup = () => {
        this.setState({ isSignup: !this.state.isSignup });
        this.cleanErrors();
    };

    // TO-DO
    handleLostPassword = () => {
        console.log('Lost password');
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formError = this.validateForm();
        if (formError) {
            this.setState({ formError });
        } else {
            const { email, username, password, isSignup } = this.state;
            this.props.onSubmit(
                {
                    email,
                    username,
                    password,
                },
                isSignup
            );
        }
    };

    validateForm = (): FormError | null => {
        const { email, isSignup, password, passwordAgain } = this.state;
        if (email == '') {
            return FormError.MISSING_EMAIL;
        } else if (!validateEmail(email)) {
            return FormError.INVALID_EMAIL;
        } else if (password == '') {
            return FormError.MISSING_PASSWORD;
        } else if (isSignup) {
            if (passwordAgain == '') {
                return FormError.MISSING_PASSWORD_AGAIN;
            }
            if (password !== passwordAgain) {
                return FormError.PASSWORD_MISMATCH;
            }
        }
        return null;
    };

    getFormErrorMessage = (error: FormError): string => {
        switch (error) {
            case FormError.MISSING_EMAIL:
                return 'Tölvupóstfang vantar';
            case FormError.MISSING_PASSWORD:
                return 'Lykilorð vantar';
            case FormError.MISSING_PASSWORD_AGAIN:
                return 'Það þarf að staðfesta lykilorð';
            case FormError.INVALID_EMAIL:
                return 'Ógilt tölvupóstfang';
            case FormError.PASSWORD_MISMATCH:
                return 'Lykilorð verða að stemma';
            default:
                return 'Villa í formi';
        }
    };

    getAuthErrorMessage = (error: AuthError): string => {
        switch (error) {
            case AuthError.USER_NOT_FOUND:
                return 'Notandi finnst ekki';
            case AuthError.WRONG_PASSWORD:
                return 'Rangt lykilorð';
            case AuthError.HAS_ACCOUNT:
                return 'Tölvupóstfang þegar skráð';
            case AuthError.EMAIL_NOT_CONFIRMED:
                return 'Tölvupóstfang hefur ekki verið staðfest';
            case AuthError.USERNAME_USED:
                return 'Notendanafnið er tekið, vinsamlegast veldu nýtt';
            default:
                return 'Innskráning mistókst';
        }
    };

    render() {
        const { formError, isSignup } = this.state;

        const authError = this.props.error;

        return (
            <LoginFormContainer onSubmit={this.handleSubmit}>
                <Title>{isSignup ? 'Nýskráning' : 'Innskráning'}</Title>
                <TextInput
                    label="Tölvupóstfang"
                    onChange={this.onEmailChange}
                    placeholder=""
                />
                {isSignup && (
                    <TextInput
                        label="Notendanafn (valfrjálst)"
                        onChange={this.onUserNameChange}
                        placeholder="þörf fyrir einstaklingskeppni grunnskólanna"
                    ></TextInput>
                )}
                <TextInput
                    label="Lykilorð"
                    onChange={this.onPasswordChange}
                    placeholder=""
                    type="password"
                />
                {isSignup && (
                    <TextInput
                        label="Lykilorð aftur"
                        onChange={this.onPasswordAgainChange}
                        placeholder=""
                        type="password"
                    />
                )}
                {(formError || authError) && (
                    <ErrorContainer>
                        {formError
                            ? this.getFormErrorMessage(formError)
                            : authError && this.getAuthErrorMessage(authError)}
                    </ErrorContainer>
                )}
                <Button color="green">
                    {isSignup ? 'Nýskrá' : 'Skrá inn'}
                </Button>
                <ForgotAndSignupContainer>
                    {isSignup ? (
                        <Button
                            type="button"
                            transparent
                            onClick={this.handleSignup}
                        >
                            Áttu aðgang?
                        </Button>
                    ) : (
                        <Link href="/tyntlykilord">
                            <Button type="button" transparent>
                                Týnt lykilorð
                            </Button>
                        </Link>
                    )}
                    <Button
                        type="button"
                        color={isSignup ? 'grey' : 'blue'}
                        onClick={this.handleSignup}
                    >
                        {isSignup ? 'Innskráning' : 'Nýskrá'}
                    </Button>
                </ForgotAndSignupContainer>
            </LoginFormContainer>
        );
    }
}

export default LoginForm;
