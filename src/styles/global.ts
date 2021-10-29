import { createGlobalStyle, css } from 'styled-components';
import BrixSansRegularOTF from '../components/ui/fonts/BrixSansRegular.otf';
import BrixSansRegularWOFF from '../components/ui/fonts/BrixSansRegular.woff';

export interface Theme {
    fonts: {
        [key: string]: string;
    };
    colors: {
        [key: string]: string;
    };
    layout: {
        [key: string]: string;
    };
    media: {
        [key: string]: string;
    };
    ui: {
        icons: {
            sizes: {
                [key: string]: string;
            };
        };
    };
    transitions: {
        [key: string]: number;
    };
    z: {
        [key: string]: number;
    };
}

export const breakpoints = {
    extraSmall: '576px',
    small: '1024px',
    medium: '1280px',
    large: '1440px',
};

// Theme used in ThemeProvider @ _app.tsx
export const theme = {
    fonts: {
        title: "'Zilla Slab', Georgia, Utopia, Charter, serif",
        transcript: "'BrixSansRegular', cursive",
    },
    colors: {
        offwhite: '#FCFCFC',
        borderGray: '#e2e2e2',
        blue: '#629ff4',
        darkerBlue: '#2D7FF0',
        red: '#FF7886',
        darkerRed: '#FF0A1F',
        green: '#60C197',
        gray: '#999999',
        darkerGreen: '#4D9B79',
        lightGray: '#f9f9f9',
        warmGray: '#959595',
        richBlack: '#02122B',
        blackOlive: '#30332E',
        validGreen: '#59cbb7',
        white: '#ffffff',
    },
    layout: {
        desktopWidth: '76rem',
        gameWidth: '60rem',
        hudHeight: '5rem',
        headerHeight: '4rem',
        headerWidth: '78rem',
        footerHeight: '13rem',
        cookieModalHeight: '7rem',
        footerWidth: '78rem',
        footerWidthSmall: '50rem',
    },
    media: {
        extraSmallDown: `@media (max-width: ${breakpoints.extraSmall})`,
        extraSmallUp: `@media (min-width: ${breakpoints.extraSmall})`,
        small: `@media (max-width: ${breakpoints.small})`,
        smallUp: `@media (min-width: ${breakpoints.small})`,
        mediumDown: `@media (max-width: ${breakpoints.medium})`,
        mediumUp: `@media (min-width: ${breakpoints.medium})`,
        largeDown: `@media (max-width: ${breakpoints.large})`,
        largeUp: `@media (min-width: ${breakpoints.large})`,
    },
    ui: {
        icons: {
            sizes: {
                small: '40px',
                medium: '60px',
                large: '100px',
            },
        },
    },
    transitions: {
        main: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    z: {
        bottom: 0,
        middle: 1,
        top: 2,
        override: 10,
    },
};

export interface ThemeWrapper {
    theme: Theme;
}

// Defining global styles which are injected in _app.tsx
export const GlobalStyle = createGlobalStyle<ThemeWrapper>`
    @font-face {
        font-family: 'BrixSans';
        src: local('BrixSans'), url(${BrixSansRegularOTF}) format('opentype'),
             url(${BrixSansRegularWOFF}) format('woff'),;

    }


    * {
        box-sizing: border-box;
    }

    html, body {
        margin: 0;
        padding: 0;
        font-family: 'BrixSans';
        font-size: 12px;
        font-smoothing: antialiased;
        -webkit-font-smoothing: antialiased;
        scroll-behavior: smooth;
        @media (min-width: 321px) {
            font-size: 14px;
        }

        @media (min-width: 380px) {
            font-size: calc(16px + 2 * ((100vw - 380px) / 760));
        }

        @media (min-width: 1024px) {
            font-size: 18px;
        }
    }

    a, a :visited, a :hover, a:focus {
        text-decoration: none;
        color: inherit;
    }
`;
