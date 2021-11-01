import {
    endTime,
    preEndTime,
    preStartTime,
    startTime,
} from '../constants/competition';

export const isCompetition = (): boolean => {
    const now = new Date();
    return now > startTime && now < endTime;
};

export const isCompetitionOver = (): boolean => {
    const now = new Date();
    return now.getTime() > endTime.getTime();
};

export const isPreCompetition = (): boolean => {
    const now = new Date();
    return now > preStartTime && now < preEndTime;
};
