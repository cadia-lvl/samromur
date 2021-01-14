import * as React from 'react';
import styled from 'styled-components';

import { AuthError, FormError } from '../../types/auth';
import * as authApi from '../../services/auth-api';

import TextInput from '../ui/input/text';
import {
    EditPasswordContainer as EditUserNameContainer,
    ErrorContainer,
    Button,
    Title,
} from './settings';

const Separator = styled.div`
    margin-top: 1.5rem;
    height: 2px;
    max-width: 30rem;
    background: ${({ theme }) => theme.colors.borderGray};
`;

interface Props {
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
}

interface State {
    done: boolean;
    error?: string;
    success: boolean;
    userName: string;
}

class EditUserNameForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            done: false,
            error: undefined,
            success: false,
            userName: '',
        };
    }

    cleanErrors = () => {
        this.setState({
            done: false,
            error: undefined,
            success: false,
        });
    };

    onUserNameChange = (userName: string) => {
        this.setState({ userName });
        this.cleanErrors();
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = this.validateForm();
        if (error) {
            this.setState({ error });
        } else {
            const { userName } = this.state;
            return authApi
                .changeUserName(userName)
                .then(() => {
                    window.location.reload();
                    this.setState({ done: true, success: true });
                })
                .catch((error) => {
                    if (error in AuthError) {
                        this.setState({ error });
                    }
                    this.setState({ done: true, success: false });
                });
        }
    };

    validateForm = (): string | null => {
        const { userName } = this.state;
        if (!userName) {
            return FormError.INVALID_USERNAME;
        }
        if (userName.length < 5) {
            return FormError.USERNAME_TOO_SHORT;
        }
        return null;
    };

    getErrorMessage = (error: string): string => {
        const { userName } = this.state;
        switch (error) {
            case FormError.INVALID_USERNAME:
                return 'Ógilt notandanafn';
            case FormError.USERNAME_TOO_SHORT:
                return 'Notandanafnið er of stutt (færri en 5 stafir)';
            case AuthError.USERNAME_USED:
                return 'Notandanafn er þegar í notkun';
            case AuthError.FAILED:
                return 'Notandi hefur nú þegar notendanafn';
            default:
                return 'Óþekkt villa';
        }
    };

    render() {
        const { done, error, success } = this.state;
        return (
            <EditUserNameContainer onSubmit={this.handleSubmit}>
                <Title>Bæta við notendanafni</Title>
                <TextInput
                    label="Notendanafn"
                    onChange={this.onUserNameChange}
                    placeholder=""
                />
                {(error || (done && !success)) && (
                    <ErrorContainer>
                        {error ? this.getErrorMessage(error) : 'Óþekkt villa'}
                    </ErrorContainer>
                )}
                <Button success={success}>
                    {success ? 'Breyting tókst' : 'Staðfesta notendanafn'}
                </Button>
                <Separator />
            </EditUserNameContainer>
        );
    }
}

export default EditUserNameForm;
