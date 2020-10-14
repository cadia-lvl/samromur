export enum DemographicError {
    NO_AGE = 'NO_AGE',
    NO_GENDER = 'NO_GENDER',
    NO_NATIVE_LANGUAGE = 'NO_NATIVE_LANGUAGE',
}

export interface Demographics {
    age: Demographic;
    gender: Demographic;
    hasConsent: boolean;
    nativeLanguage: Demographic;
}

export interface Demographic {
    id: string;
    name: string;
}

export interface UserClient {
    id: string;
    isAuthenticated: boolean;
    clips?: number;
}

export interface UserConsents {
    cookies: boolean;
    terms: boolean;
}

export const initialDemographics: Demographics = {
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
    }
};