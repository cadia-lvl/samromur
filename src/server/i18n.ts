import NextI18Next, { WithTranslation as WT } from 'next-i18next';

// To-do: change initialization of i18n to remove warning on server startup
export const nextI18next = new NextI18Next({
    defaultLanguage: 'isl',
    otherLanguages: ['en', 'isl'],
    detection: {
        lookupCookie: 'next-i18next',
        order: ['cookie', 'querystring', 'localStorage', 'path', 'subdomain'],
        caches: ['cookie'],
    },
});

export const appWithTranslation = nextI18next.appWithTranslation;
export const withTranslation = nextI18next.withTranslation;
export const useTranslation = nextI18next.useTranslation;
export type WithTranslation = WT;
