import * as React from 'react';
import styled from 'styled-components';
import TextInput from '../ui/input/text';
import * as authApi from '../../services/auth-api';
import validateEmail from '../../utilities/validate-email';
import { FormError } from '../../types/auth';
import { withTranslation, WithTranslation } from '../../server/i18n';

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

type Props = WithTranslation;

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
        const { t } = this.props;
        return (
            <ForgotPasswordContainer>
                <Title>{t('forgot-password') + '?'}</Title>
                {!resetEmailSent ? (
                    <div>
                        <TextInput
                            label={t('common:email')}
                            onChange={this.onEmailChange}
                            placeholder=""
                        />
                        {validEmail && (
                            <ErrorContainer>
                                {t('errors.invalid-email')}
                            </ErrorContainer>
                        )}
                        <Button onClick={this.handleResetPassword}>
                            {t('common:submit')}
                        </Button>
                    </div>
                ) : (
                    <Paragraph>
                        {t('forgot-password-page.email-sent')} {email}
                    </Paragraph>
                )}
            </ForgotPasswordContainer>
        );
    }
}

export default withTranslation(['my-pages', 'common'])(ForgotPassword);
