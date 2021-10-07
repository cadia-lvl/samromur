import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { setAuthenticated, setClientId } from '../store/user/actions';

import * as authApi from '../services/auth-api';
import cookies from 'next-cookies';

import Layout from '../components/layout/layout';
import LoginForm from '../components/login/login-form';
import SignupSuccess from '../components/login/signup-success';

import { AuthError, AuthRequest } from '../types/auth';
import Loading from '../components/ui/icons/loading';

const LoginPageContainer = styled.div`
    width: 100%;
    margin: 1rem auto;
    padding: 0.5rem;
`;

const spin = keyframes`
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
`;

const SpinningLoader = styled(Loading)`
    animation-name: ${spin};
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;

const LoaderContainer = styled.div`
    margin: auto;
    display: flex;
    justify-content: center;
`;

const dispatchProps = {
    setAuthenticated,
    setClientId,
};

interface LoginProps {
    redirect: string;
}

interface State {
    email: string;
    error?: AuthError;
    signupSuccess: boolean;
    loading: boolean;
}

type Props = LoginProps & typeof dispatchProps;

class LoginPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            error: undefined,
            signupSuccess: false,
            loading: false,
        };
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        const { redirect } = cookies(ctx) || '';
        return {
            namespacesRequired: ['common'],
            redirect: !!redirect ? redirect : '/minar-sidur',
        };
    };

    handleError = (error: AuthError) => {
        this.setState({ error });
    };

    removeError = () => {
        this.setState({ error: undefined });
    };

    loading = () => {
        this.setState({ loading: true });
    };

    loadingFinished = () => {
        this.setState({ loading: false });
    };

    handleSubmit = async (auth: AuthRequest, isSignup: boolean) => {
        this.loading();
        if (isSignup) {
            const { email } = auth;
            return authApi
                .signUp(auth)
                .then(() => {
                    this.setState({ email, signupSuccess: true });
                })
                .catch(this.handleError)
                .finally(this.loadingFinished);
        } else {
            return authApi
                .login(auth)
                .then((clientId: string) => {
                    this.props.setClientId(clientId);
                    window.location.replace(this.props.redirect);
                })
                .catch(this.handleError)
                .finally(this.loadingFinished);
        }
    };

    render() {
        const { email, error, signupSuccess, loading } = this.state;
        return (
            <Layout>
                <LoginPageContainer>
                    {signupSuccess ? (
                        <SignupSuccess email={email} />
                    ) : (
                        <LoginForm
                            error={error}
                            onSubmit={this.handleSubmit}
                            removeError={this.removeError}
                            loading={loading}
                        />
                    )}
                    {loading && (
                        <LoaderContainer>
                            <SpinningLoader large></SpinningLoader>
                        </LoaderContainer>
                    )}
                </LoginPageContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(LoginPage);
