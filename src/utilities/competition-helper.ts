import {
    endTime,
    gk2022ageChart,
    gk2022genderChart,
    gk2022timeline,
    preEndTime,
    preStartTime,
    revealTime,
    startTime,
    suspenseTime,
} from '../constants/competition';
import {
    AgeStat,
    GenderStat,
    ScoreboardData,
    TimelineStat,
} from '../types/competition';

export const isCompetition = (): boolean => {
    const now = new Date();
    return now > startTime && now < endTime;
};

export const isCompetitionOver = (): boolean => {
    const now = new Date();
    return now.getTime() > endTime.getTime();
};

export const isSuspense = (): boolean => {
    const now = new Date();
    return (
        now.getTime() > suspenseTime.getTime() &&
        now.getTime() < revealTime.getTime()
    );
};

export const isCompetitionAndSuspenseOver = (): boolean => {
    return isCompetitionOver() && !isSuspense();
};

export const isPreCompetition = (): boolean => {
    const now = new Date();
    return now > preStartTime && now < preEndTime;
};

export const sizeFormatter = (cell: any, row: ScoreboardData) => {
    switch (row.size) {
        case 'small':
            return '1-70';
        case 'medium':
            return '71-300';
        case 'large':
            return '300+';
        default:
            return '';
    }
};

export const schoolSizeFormatter = (cell: any, row: ScoreboardData) => {
    switch (row.size) {
        case 'small':
            return 'C';
        case 'medium':
            return 'B';
        case 'large':
            return 'A';
        default:
            return '';
    }
};

export const getFakeScores = (): { data: ScoreboardData[]; error: any } => {
    return { data: fakeScores, error: '' };
};

export const getStaticCompetitionGenderStats = (): {
    data: GenderStat[];
    error: any;
} => {
    return { data: gk2022genderChart, error: '' };
};

export const getStaticCompetitionAgeStats = (): {
    data: AgeStat[];
    error: any;
} => {
    return { data: gk2022ageChart, error: '' };
};

export const getStaticCompetitionTimelineStats = (): {
    data: TimelineStat[];
    error: any;
} => {
    return { data: gk2022timeline, error: '' };
};

export const fakeScores: ScoreboardData[] = [
    {
        name: 'Þetta eru bara ',
        size: 'medium',
        users: 405,
        count: 76934,
        rank: 1,
    },
    {
        name: 'þykjustugögn',
        size: 'medium',
        users: 309,
        count: 76773,
        rank: 2,
    },
    {
        name: 'svindlarinn þinn!',
        size: 'medium',
        users: 290,
        count: 49280,
        rank: 3,
    },
    {
        name: 'Biddu, eins',
        size: 'large',
        users: 387,
        count: 44994,
        rank: 4,
    },
    {
        name: 'og aðrir :D',
        size: 'small',
        users: 133,
        count: 37725,
        rank: 5,
    },
    {
        name: 'Þetta eru bara ',
        size: 'small',
        users: 171,
        count: 35310,
        rank: 6,
    },
    {
        name: 'þykjustugögn',
        size: 'large',
        users: 167,
        count: 22963,
        rank: 7,
    },
    {
        name: 'svindlarinn þinn!',
        size: 'large',
        users: 112,
        count: 20825,
        rank: 8,
    },
    {
        name: 'Biddu, eins',
        size: 'medium',
        users: 104,
        count: 16422,
        rank: 9,
    },
    {
        name: 'og aðrir :D',
        size: 'medium',
        users: 89,
        count: 15646,
        rank: 10,
    },
    {
        name: 'Þetta eru bara ',
        size: 'small',
        users: 103,
        count: 14328,
        rank: 11,
    },
    {
        name: 'þykjustugögn',
        size: 'large',
        users: 134,
        count: 13319,
        rank: 12,
    },
    {
        name: 'svindlarinn þinn!',
        size: 'small',
        users: 66,
        count: 10050,
        rank: 13,
    },
    {
        name: 'Biddu, eins',
        size: 'large',
        users: 67,
        count: 7872,
        rank: 14,
    },
    {
        name: 'og allir aðrir :D',
        size: 'medium',
        users: 57,
        count: 5176,
        rank: 15,
    },
];
