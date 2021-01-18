import React from 'react';
import { connect, Provider } from 'react-redux';
import App, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
import initStore from '../store';
import { getSkipTips } from '../utilities/local-storage';

import { RootState } from 'typesafe-actions';

import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from '../styles/global';

import cookies from 'next-cookies';
import { setUserCookie } from '../utilities/cookies';
import {
    setAuthenticated,
    setUserAgent,
    setDemographics,
    setConsents,
    fetchUser,
    setSkipTips,
    setUserName,
} from '../store/user/actions';
import { getUserAgent } from '../utilities/browser';

import makeSSRDispatch from '../utilities/ssr-request';

import { Store } from 'typesafe-actions';
import { appWithTranslation } from '../server/i18n';

import 'react-markdown-editor-lite/lib/index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Demographics, UserConsents } from '../types/user';
import { generateGUID } from '../utilities/id';

interface CustomAppProps {
    appProps: {
        user: {
            clientId: string;
            hasCookie: boolean;
            isAuthenticated: boolean;
        };
    };
    store: Store;
}

const dispatchProps = {
    setAuthenticated,
    setDemographics,
    setUserAgent,
    setConsents,
    setSkipTips,
};

type Props = ReturnType<typeof mapStateToProps> &
    AppProps &
    CustomAppProps &
    typeof dispatchProps;

class MyApp extends App<Props> {
    static async getInitialProps({ Component, ctx }: AppContext) {
        const { isServer, req, store } = ctx;
        const allCookies = cookies(ctx);
        const { client_id } = allCookies;
        const hasCookie = !!client_id;
        const clientId = client_id || generateGUID();

        const isAuthenticated = ctx.req?.headers['is_authenticated'] === 'true';

        const appProps = {
            user: {
                clientId,
                hasCookie,
                isAuthenticated,
            },
            namespacesRequired: [],
        };

        let pageProps = Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {};

        Object.assign(pageProps, { namespacesRequired: ['common'] });

        return { pageProps, appProps };
    }

    componentDidMount = async () => {
        const {
            appProps,
            setAuthenticated,
            setDemographics,
            setUserAgent,
            setConsents,
            setSkipTips,
        } = this.props;

        // Set userAgent in store
        const userAgent = getUserAgent();
        setUserAgent(userAgent);

        // Set authentication boolean in store
        setAuthenticated(appProps.user.isAuthenticated);

        // If the user has consents in local storage, set it in store
        const consents: UserConsents =
            JSON.parse(localStorage.getItem('consents') as string) || undefined;
        !!consents && setConsents(consents as UserConsents);

        // If the user has demographics in local storage, set it in store
        const demographics: Demographics =
            JSON.parse(localStorage.getItem('demographics') as string) ||
            undefined;
        !!demographics && setDemographics(demographics as Demographics);

        // If the user has the skipTips tag in local storage, set it in store
        const skipTips: boolean = getSkipTips();
        skipTips && setSkipTips(skipTips);

        // If the user does not have a cookie, set it
        !appProps.user.hasCookie && setUserCookie(appProps.user.clientId);

        // Use audio-recorder-polyfill if necessary
        const [AudioRecorder] = await Promise.all([
            typeof window.MediaRecorder === 'undefined'
                ? require('audio-recorder-polyfill')
                : Promise.resolve(),
        ]);

        if (AudioRecorder) {
            window.MediaRecorder = AudioRecorder.default;
        }
    };

    render() {
        const { Component, appProps, pageProps, store } = this.props;
        return (
            <>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <GlobalStyle />
                        <Head>
                            <title>Samrómur</title>
                        </Head>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Provider>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default withRedux(initStore)(
    connect(mapStateToProps, dispatchProps)(appWithTranslation(MyApp))
);
