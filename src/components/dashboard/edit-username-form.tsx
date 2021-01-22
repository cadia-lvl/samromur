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

import validateUsername from '../../utilities/validate-username';

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
    username: string;
}

class EditUserNameForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            done: false,
            error: undefined,
            success: false,
            username: '',
        };
    }

    cleanErrors = () => {
        this.setState({
            done: false,
            error: undefined,
            success: false,
        });
    };

    onUserNameChange = (username: string) => {
        this.setState({ username });
        this.cleanErrors();
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = this.validateForm();
        if (error) {
            this.setState({ error });
        } else {
            const { username } = this.state;
            return authApi
                .changeUserName(username)
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
        const { username } = this.state;
        if (username.length < 5) {
            return FormError.USERNAME_TOO_SHORT;
        }
        if (!validateUsername(username)) {
            return FormError.INVALID_USERNAME;
        }
        return null;
    };

    getErrorMessage = (error: string): string => {
        switch (error) {
            case FormError.INVALID_USERNAME:
                return 'Aðeins bókstafir, bandstrik og undirstrik eru leyfileg. Lágmark 5 stafir';
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
