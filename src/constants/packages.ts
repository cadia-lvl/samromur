import { Goal } from '../types/contribute';

export const speakGoals: Goal[] = [
    {
        contributeType: 'tala',
        name: 'Lítið',
        text: '10 setningar',
        count: 10,
    },
    {
        contributeType: 'tala',
        name: 'Miðlungs',
        text: '20 setningar',
        count: 20,
    },
    {
        contributeType: 'tala',
        name: 'Mikið',
        text: '50 setningar',
        count: 50,
    },
];

export const listenGoals: Goal[] = [
    {
        contributeType: 'hlusta',
        name: 'Lítinn',
        text: '10 upptökur',
        count: 10
    },
    {
        contributeType: 'hlusta',
        name: 'Miðstærð',
        text: '20 upptökur',
        count: 20,
    },
    {
        contributeType: 'hlusta',
        name: 'Stóran',
        text: '50 upptökur',
        count: 50,
    },
];
