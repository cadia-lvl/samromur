import * as React from 'react';
import styled from 'styled-components';
import TextInput from '../ui/input/text';
import { FormError, AuthError } from '../../types/auth';
import * as authApi from '../../services/auth-api';
import Link from 'next/link';
import { withTranslation, WithTranslation } from '../../server/i18n';

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

const NavLink = styled.a`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 600;
    cursor: pointer;
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

interface ResetPasswordProps {
    token: string;
}

type Props = ResetPasswordProps & WithTranslation;

interface State {
    password: string;
    passwordAgain: string;
    error?: FormError | AuthError;
    success: boolean;
}

class ResetPassword extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            password: '',
            passwordAgain: '',
            error: undefined,
            success: false,
        };
    }

    /**
     * An api request is sent to reset the password if the password is valid,
     * Otherwise the error state is updated.
     */
    handleResetPassword = async () => {
        const error = this.validatePassword();
        const { password } = this.state;
        const { token } = this.props;
        if (error) {
            this.setState({ error });
        } else {
            const passwordResetSuccess = await authApi.resetPassword(
                token,
                password
            );
            if (!passwordResetSuccess) {
                this.setState({ error: AuthError.FAILED });
            }
            this.setState({ success: passwordResetSuccess });
        }
    };

    /**
     * Validates that the password matches the password again field
     * and that it is a valid password.
     * Returns a formError if the password is invalid and null otherwise
     */
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
        const { t } = this.props;
        switch (error) {
            case FormError.MISSING_PASSWORD:
                return t('errors.missing-password');
            case FormError.MISSING_PASSWORD_AGAIN:
                return t('errors.missing-password-again');
            case FormError.PASSWORD_MISMATCH:
                return t('errors.password-mismatch');
            default:
                return t('errors.unknown-error');
        }
    };
    render() {
        const { error, success } = this.state;
        const { t } = this.props;
        return (
            <ForgotPasswordContainer>
                {success ? (
                    <div>
                        <Title>{t('reset-password.password-reset')}</Title>
                        <Link href="/innskraning">
                            <NavLink>
                                {t('reset-password.to-log-on-page')}
                            </NavLink>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Title>{t('reset-password.title')}</Title>
                        <TextInput
                            label={t('password-label')}
                            onChange={this.onPasswordChange}
                            placeholder=""
                            type="password"
                        />
                        <TextInput
                            label={t('password-again-label')}
                            onChange={this.onPasswordAgainChange}
                            placeholder=""
                            type="password"
                        />
                        {error && (
                            <ErrorContainer>
                                {this.getErrorMessage()}
                            </ErrorContainer>
                        )}
                        <Button onClick={this.handleResetPassword}>
                            {t('common:submit')}
                        </Button>
                    </div>
                )}
            </ForgotPasswordContainer>
        );
    }
}

export default withTranslation(['my-pages', 'common'])(ResetPassword);
