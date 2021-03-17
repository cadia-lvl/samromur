import { ContributeType, Goal } from '../types/contribute';

export const speakGoals: Goal[] = [
    {
        contributeType: ContributeType.SPEAK,
        name: 'Lítið',
        text: '10 setningar',
        count: 10,
    },
    {
        contributeType: ContributeType.SPEAK,
        name: 'Miðlungs',
        text: '20 setningar',
        count: 20,
    },
    {
        contributeType: ContributeType.SPEAK,
        name: 'Mikið',
        text: '50 setningar',
        count: 50,
    },
];

export const listenGoals: Goal[] = [
    {
        contributeType: ContributeType.LISTEN,
        name: 'Lítinn',
        text: '10 upptökur',
        count: 10,
    },
    {
        contributeType: ContributeType.LISTEN,
        name: 'Miðstærð',
        text: '20 upptökur',
        count: 20,
    },
    {
        contributeType: ContributeType.LISTEN,
        name: 'Stóran',
        text: '50 upptökur',
        count: 50,
    },
];

export const repeatGoals: Goal[] = [
    {
        contributeType: ContributeType.REPEAT,
        name: 'Lítinn',
        text: '10 upptökur',
        count: 10,
    },
    {
        contributeType: ContributeType.REPEAT,
        name: 'Miðstærð',
        text: '20 upptökur',
        count: 20,
    },
    {
        contributeType: ContributeType.REPEAT,
        name: 'Stóran',
        text: '50 upptökur',
        count: 50,
    },
];
