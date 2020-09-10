import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import Router from 'next/router'
import styled from 'styled-components';

import Layout from '../components/layout/layout';
import LoginForm from '../components/login/login-form';
import { setAuthenticated } from '../store/user/actions';

import * as authApi from '../services/auth-api';
import cookies from 'next-cookies';

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
    setAuthenticated
}

interface LoginProps {
    redirect: string;
}

interface State {
    error?: AuthError;
}

type Props = LoginProps & typeof dispatchProps;

class LoginPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            error: undefined,
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
            return authApi.signUp(auth).then(() => {
                // Handle signup
            }).catch(this.handleError);
        } else {
            return authApi.login(auth).then(() => {
                window.location.replace(this.props.redirect);
            }).catch(this.handleError);
        }

    }

    render() {
        const { error } = this.state;
        return (
            <Layout>
                <LoginPageContainer>
                    <LoginForm
                        error={error}
                        onSubmit={this.handleSubmit}
                        removeError={this.removeError}
                    />
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