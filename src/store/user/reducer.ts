import { createReducer } from 'typesafe-actions';
import { UserState } from './state';
import * as userActions from './actions';
import { generateGUID } from '../../utilities/id';
import {
    injectDemographics,
    injectConsents,
    injectSkipTips,
} from '../../utilities/local-storage';
import { setUserCookie } from '../../utilities/cookies';

const defaultDemoGraphics = {
    age: {
        id: '',
        name: '',
    },
    gender: {
        id: '',
        name: '',
    },
    hasConsent: false,
    nativeLanguage: {
        id: '',
        name: '',
    },
    school: {
        name: '',
        code: '',
    },
};

const initialState: UserState = {
    client: {
        id: generateGUID(),
        isAdmin: false,
        isAuthenticated: false,
        isSuperUser: false,
        stats: {
            clips: undefined,
            votes: undefined,
        },
        skipTips: false,
        username: '',
    },
    demographics: defaultDemoGraphics,
    consents: {
        cookies: false,
        terms: false,
    },
    userAgent: '',
};

export default createReducer(initialState)
    .handleAction(userActions.setDemographics, (state, action) => {
        injectDemographics(action.payload);
        return {
            ...state,
            demographics: action.payload,
        };
    })
    .handleAction(userActions.setCookieConsent, (state, action) => {
        injectConsents({
            ...state.consents,
            cookies: action.payload,
        });
        return {
            ...state,
            consents: {
                ...state.consents,
                cookies: action.payload,
            },
        };
    })
    .handleAction(userActions.setTermsConsent, (state, action) => {
        injectConsents({
            ...state.consents,
            terms: action.payload,
        });
        return {
            ...state,
            consents: {
                ...state.consents,
                terms: action.payload,
            },
        };
    })
    .handleAction(userActions.setConsents, (state, action) => {
        return {
            ...state,
            consents: action.payload,
        };
    })
    .handleAction(userActions.setClientId, (state, action) => {
        setUserCookie(action.payload);
        return {
            ...state,
            client: {
                ...state.client,
                id: action.payload,
            },
        };
    })
    .handleAction(userActions.setUserAgent, (state, action) => {
        return {
            ...state,
            userAgent: action.payload,
        };
    })
    .handleAction(userActions.setAuthenticated, (state, action) => {
        return {
            ...state,
            client: {
                ...state.client,
                isAuthenticated: action.payload,
            },
        };
    })
    .handleAction(userActions.setSkipTips, (state, action) => {
        injectSkipTips(action.payload);
        return {
            ...state,
            client: {
                ...state.client,
                skipTips: action.payload,
            },
        };
    })
    .handleAction(userActions.setUserName, (state, action) => {
        return {
            ...state,
            client: {
                ...state.client,
                username: action.payload,
            },
        };
    })
    .handleAction(userActions.fetchUser.request, (state) => state)
    .handleAction(userActions.fetchUser.success, (state, action) => {
        return {
            ...state,
            client: {
                ...state.client,
                ...action.payload,
            },
        };
    })
    .handleAction(userActions.fetchUser.failure, (state, action) => {
        return state;
    })
    .handleAction(userActions.resetDemographics, (state) => {
        injectDemographics(defaultDemoGraphics);
        return {
            ...state,
            demographics: defaultDemoGraphics,
        };
    });
