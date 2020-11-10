import * as React from 'react';
import styled from 'styled-components';

import { FormError } from '../../types/auth';
import * as authApi from '../../services/auth-api';

import TextInput from '../ui/input/text';

const DashboardSettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    padding: 2rem;
`;

const EditPasswordContainer = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
`;

const ErrorContainer = styled.div`
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.red};
`;

interface ButtonProps {
    success: boolean;
}

const Button = styled.button<ButtonProps>`
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    background-color: ${({ theme, success }) =>
        success ? theme.colors.green : theme.colors.blue};
    color: white;
    cursor: pointer;

    :active {
        transform: translateY(2px);
        outline: none;
    }

    :focus {
        outline: none;
    }
`;

const Title = styled.h3`
    margin-bottom: 2rem;
`;

interface Props {
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
}

interface State {
    done: boolean;
    formError?: FormError;
    oldPassword: string;
    password: string;
    passwordAgain: string;
    success: boolean;
}

class DashboardSettings extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            done: false,
            formError: undefined,
            oldPassword: '',
            password: '',
            passwordAgain: '',
            success: false,
        };
    }

    cleanErrors = () => {
        this.setState({
            done: false,
            formError: undefined,
            success: false,
        });
    };

    onOldPasswordChange = (oldPassword: string) => {
        this.setState({ oldPassword });
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

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formError = this.validateForm();
        if (formError) {
            this.setState({ formError });
        } else {
            const { oldPassword, password } = this.state;
            return authApi
                .changePassword(oldPassword, password)
                .then(() => {
                    this.setState({ done: true, success: true });
                })
                .catch(() => {
                    this.setState({ done: true, success: false });
                });
        }
    };

    validateForm = (): FormError | null => {
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

    getFormErrorMessage = (error: FormError): string => {
        switch (error) {
            case FormError.MISSING_PASSWORD:
                return 'Núverandi lykilorð vantar';
            case FormError.MISSING_PASSWORD_AGAIN:
                return 'Það þarf að staðfesta lykilorð';
            case FormError.PASSWORD_MISMATCH:
                return 'Lykilorð verða að stemma';
            default:
                return 'Villa í formi';
        }
    };

    render() {
        const { done, formError, success } = this.state;
        return (
            <DashboardSettingsContainer>
                <EditPasswordContainer onSubmit={this.handleSubmit}>
                    <Title>Breyta lykilorði</Title>
                    <TextInput
                        label="Núverandi lykilorð"
                        onChange={this.onOldPasswordChange}
                        placeholder=""
                        type="password"
                    />
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
                    {(formError || (done && !success)) && (
                        <ErrorContainer>
                            {formError
                                ? this.getFormErrorMessage(formError)
                                : 'Rangt lykilorð'}
                        </ErrorContainer>
                    )}
                    <Button success={success}>
                        {success ? 'Breyting tókst' : 'Staðfesta'}
                    </Button>
                </EditPasswordContainer>
            </DashboardSettingsContainer>
        );
    }
}

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <DashboardSettings {...props} ref={ref as any} />
    )
);
