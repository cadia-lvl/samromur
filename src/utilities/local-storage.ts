import { Demographics, UserConsents } from '../types/user';

export const injectDemographics = (demographics: Demographics) => {
    localStorage.setItem(
        'demographics',
        JSON.stringify({
            ...demographics,
        })
    );
};

export const injectConsents = (consents: UserConsents) => {
    localStorage.setItem(
        'consents',
        JSON.stringify({
            ...consents,
        })
    );
};

export const injectSkipTips = (skipTips: boolean) => {
    localStorage.setItem('skipTips', skipTips.toString());
};

export const getSkipTips = (): boolean => {
    const skipTips = localStorage.getItem('skipTips');
    return skipTips === 'true';
};
