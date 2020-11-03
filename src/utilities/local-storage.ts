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
