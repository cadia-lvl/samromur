import { createGlobalStyle, css } from 'styled-components';

export interface Theme {
    fonts: {
        [key: string]: string;
    };
    colors: {
        [key: string]: string;
    };
    layout: {
        [key: string]: string;
    }
    media: {
        [key: string]: string;
    };
    ui: {
        icons: {
            sizes: {
                [key: string]: string;
            };
        };
    }
    transitions: {
        [key: string]: number;
    }
    z: {
        [key: string]: number;
    }
}

const breakpoints = {
    small: '1024px',
    medium: '1280px',
    large: '1440px',
}

// Theme used in ThemeProvider @ _app.tsx
export const theme = {
    fonts: {
        title: "'Zilla Slab', Georgia, Utopia, Charter, serif",
        transcript: "'Voces', cursive",
    },
    colors: {
        offwhite: '#FCFCFC',
        borderGray: '#e2e2e2',
        blue: '#0099ff',
        darkerBlue: '#2D7FF0',
        red: '#ff4f5e',
        darkerRed: '#FF0A1F',
        green: '#60C197',
        gray: '#999999',
        darkerGreen: '#4D9B79',
        lightGray: '#f9f9f9',
        warmGray: '#959595',
        richBlack: '#02122B',
        blackOlive: '#30332E'
    },
    layout: {
        desktopWidth: '76rem',
        gameWidth: '60rem',
        hudHeight: '5rem',
        headerHeight: '4rem',
        headerWidth: '78rem',
        footerHeight: '10rem',
        footerWidth: '78rem',
        footerWidthSmall: '50rem'
    },
    media: {
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
            }
        }
    },
    transitions: {
        main: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    z: {
        bottom: 0,
        middle: 1,
        top: 2,
        override: 10,
    }
}

export interface ThemeWrapper {
    theme: Theme;
}

// Defining global styles which are injected in _app.tsx
export const GlobalStyle = createGlobalStyle<ThemeWrapper>`
    * {
        box-sizing: border-box;
    }
    html, body {
        margin: 0;
        padding: 0;
        font-family: ${({ theme }) => theme.fonts.transcript};
        font-size: 12px;
        font-smoothing: antialiased;
        -webkit-font-smoothing: antialiased;
        @media (min-width: 320px) {
            font-size: 14px;
        }

        @media (min-width: 380px) {
            font-size: calc(16px + 2 * ((100vw - 380px) / 760));
        }

        @media (min-width: 1024px) {
            font-size: 18px;
        }
    }

    a, a: visited, a: hover, a: focus {
        text-decoration: none;
        color: inherit;
    }
`