import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import styled from 'styled-components';

import {
    setAuthenticated,
    setClientId
} from '../store/user/actions';

import * as authApi from '../services/auth-api';
import cookies from 'next-cookies';

import Layout from '../components/layout/layout';
import LoginForm from '../components/login/login-form';
import SignupSuccess from '../components/login/signup-success';

import {
    AuthError,
    AuthRequest
} from '../types/auth';

const LoginPageContainer = styled.div`
    width: 100%;
    margin: 1rem auto;
    padding: 0.5rem;
`;

const dispatchProps = {
    setAuthenticated,
    setClientId,
}

interface LoginProps {
    redirect: string;
}

interface State {
    email: string;
    error?: AuthError;
    signupSuccess: boolean;
}

type Props = LoginProps & typeof dispatchProps;

class LoginPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            error: undefined,
            signupSuccess: false,
        }
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        const { redirect } = cookies(ctx) || '';
        return ({
            namespacesRequired: ['common'],
            redirect: !!redirect ? redirect : '/minar-sidur'
        });
    }

    handleError = (error: AuthError) => {
        this.setState({ error });
    }

    removeError = () => {
        this.setState({ error: undefined });
    }

    handleSubmit = async (auth: AuthRequest, isSignup: boolean) => {
        if (isSignup) {
            const { email } = auth;
            return authApi.signUp(auth).then(() => {
                this.setState({ email, signupSuccess: true });
            }).catch(this.handleError);
        } else {
            return authApi.login(auth).then((clientId: string) => {
                this.props.setClientId(clientId);
                window.location.replace(this.props.redirect);
            }).catch(this.handleError);
        }

    }

    render() {
        const { email, error, signupSuccess } = this.state;
        return (
            <Layout>
                <LoginPageContainer>
                    {
                        signupSuccess
                            ?
                            <SignupSuccess
                                email={email}
                            />
                            : <LoginForm
                                error={error}
                                onSubmit={this.handleSubmit}
                                removeError={this.removeError}
                            />
                    }

                </LoginPageContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(LoginPage);