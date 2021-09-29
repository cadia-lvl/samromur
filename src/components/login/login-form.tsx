import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import TextInput from '../ui/input/text';
import { Button } from '../ui/buttons';

import { AuthError, AuthRequest, FormError } from '../../types/auth';

import validateEmail from '../../utilities/validate-email';
import validateUserName from '../../utilities/validate-username';
import { WithTranslation, withTranslation } from '../../server/i18n';

interface LoginFormContainerProps {
    disabled: boolean;
}

const LoginFormContainer = styled.form<LoginFormContainerProps>`
    margin: 1rem auto;
    max-width: 30rem;
    display: flex;
    flex-direction: column;
    transition: opacity 0.1s ease-in-out;

    ${({ disabled }) => (disabled ? `opacity: 0.6; pointer-events: none;` : ``)}
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

interface LoginFormProps {
    error?: AuthError;
    onSubmit: (auth: AuthRequest, isSignup: boolean) => void;
    removeError: () => void;
    loading: boolean;
}

type Props = LoginFormProps & WithTranslation;

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
        const {
            email,
            isSignup,
            password,
            passwordAgain,
            username,
        } = this.state;
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
            if (username) {
                if (!validateUserName(username)) {
                    return FormError.INVALID_USERNAME;
                }
            }
        }
        return null;
    };

    getFormErrorMessage = (error: FormError): string => {
        const { t } = this.props;
        switch (error) {
            case FormError.MISSING_EMAIL:
                return t('errors.missing-email');
            case FormError.MISSING_PASSWORD:
                return t('errors.missing-password');
            case FormError.MISSING_PASSWORD_AGAIN:
                return t('errors.missing-password-again');
            case FormError.INVALID_EMAIL:
                return t('errors.invalid-email');
            case FormError.PASSWORD_MISMATCH:
                return t('errors.password-mismatch');
            case FormError.INVALID_USERNAME:
                return t('errors.invalid-username');
            default:
                return t('errors.form-error');
        }
    };

    getAuthErrorMessage = (error: AuthError): string => {
        const { t } = this.props;
        switch (error) {
            case AuthError.USER_NOT_FOUND:
                return t('auth-errors.user-not-found');
            case AuthError.WRONG_PASSWORD:
                return t('auth-errors.wrong-password');
            case AuthError.HAS_ACCOUNT:
                return t('auth-errors.has-account');
            case AuthError.EMAIL_NOT_CONFIRMED:
                return t('auth-errors.email-not-confirmed');
            case AuthError.USERNAME_USED:
                return t('auth-errors.username-in-use');
            default:
                return t('auth-errors.sign-in-failed');
        }
    };

    render() {
        const { formError, isSignup } = this.state;

        const authError = this.props.error;

        const { t, loading } = this.props;

        return (
            <LoginFormContainer onSubmit={this.handleSubmit} disabled={loading}>
                <Title>{isSignup ? t('signup-title') : t('login-title')}</Title>
                <TextInput
                    label={t('common:email')}
                    onChange={this.onEmailChange}
                    placeholder=""
                />
                {isSignup && (
                    <TextInput
                        label={t('username-label')}
                        onChange={this.onUserNameChange}
                        placeholder={t('username-place-holder')}
                    ></TextInput>
                )}
                <TextInput
                    label={t('password-label')}
                    onChange={this.onPasswordChange}
                    placeholder=""
                    type="password"
                />
                {isSignup && (
                    <TextInput
                        label={t('password-again-label')}
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
                    {isSignup ? t('new-user') : t('login')}
                </Button>
                <ForgotAndSignupContainer>
                    {isSignup ? (
                        <Button
                            type="button"
                            transparent
                            onClick={this.handleSignup}
                        >
                            {t('have-account')}
                        </Button>
                    ) : (
                        <Link href="/tyntlykilord">
                            <Button type="button" transparent>
                                {t('forgot-password')}
                            </Button>
                        </Link>
                    )}
                    <Button
                        type="button"
                        color={isSignup ? 'grey' : 'blue'}
                        onClick={this.handleSignup}
                    >
                        {isSignup ? t('login-title') : t('signup-title')}
                    </Button>
                </ForgotAndSignupContainer>
            </LoginFormContainer>
        );
    }
}

export default withTranslation(['my-pages', 'common'])(LoginForm);
