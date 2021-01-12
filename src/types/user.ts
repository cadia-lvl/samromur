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
    school: Partial<School>;
}

export interface Demographic {
    id: string;
    name: string;
}

export interface School {
    name: string;
    code: string;
    class1_3: number;
    class4_10: number;
    total: number;
    division: number;
}

export interface TotalUserClips {
    count: number;
    valid: number;
    invalid: number;
}

export interface TotalUserVotes {
    count: number;
    super: number;
}

export interface UserStats {
    clips?: TotalUserClips;
    votes?: TotalUserVotes;
}

export interface SuperUserStat {
    email: string;
    count: number;
}

export interface UserClient {
    id: string;
    isAdmin: boolean;
    isAuthenticated: boolean;
    isSuperUser: boolean;
    stats: UserStats;
    skipTips: boolean;
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
    },
    school: {
        code: '',
        name: '',
    },
};
