import { AgeStat, GenderStat } from '../types/competition';
import { TimelineStat } from '../types/stats';

// Dates from Reddum malinu
// export const startTime = new Date(2021, 10, 8, 0, 0, 0, 0);
// export const lastDay = new Date(2021, 10, 15, 0, 0, 0);
// export const endTime = new Date(2021, 10, 16, 0, 0, 0);
// export const signUpStart = new Date(2021, 10, 1, 0, 0, 0);
export const preStartTime = new Date(2021, 10, 2, 0, 0, 0);
export const preLastDay = new Date(2021, 10, 7, 0, 0, 0);
export const preEndTime = new Date(2021, 10, 8, 0, 0, 0);

export const startTime = new Date(2022, 0, 20, 13, 0, 0, 0);
export const lastDay = new Date(2022, 0, 26, 0, 0, 0);
export const endTime = new Date(2022, 0, 27, 0, 0, 0);

export const defaultTimeline: TimelineStat[] = [
    { date: '2022-01-20', count: 0 },
    { date: '2022-01-21', count: 0 },
    { date: '2022-01-22', count: 0 },
    { date: '2022-01-23', count: 0 },
    { date: '2022-01-24', count: 0 },
    { date: '2022-01-25', count: 0 },
    { date: '2022-01-26', count: 0 },
];

export const preDefaultTimeline: TimelineStat[] = [
    { date: '2021-11-02', count: 0 },
    { date: '2021-11-03', count: 0 },
    { date: '2021-11-04', count: 0 },
    { date: '2021-11-05', count: 0 },
    { date: '2021-11-06', count: 0 },
    { date: '2021-11-07', count: 0 },
];

export const defaultGenderStats: GenderStat[] = [
    { gender: 'kona', count: 0 },
    { gender: 'karl', count: 0 },
    { gender: 'annad', count: 0 },
];

export const defaultAgeStats: AgeStat[] = [
    { age: '0-9 ára', count: 0 },
    { age: '10-12 ára', count: 0 },
    { age: '13-17 ára', count: 0 },
    { age: '18-19 ára', count: 0 },
    { age: '20-29 ára', count: 0 },
    { age: '30-39 ára', count: 0 },
    { age: '40-49 ára', count: 0 },
    { age: '50-59 ára', count: 0 },
    { age: '60-69 ára', count: 0 },
    { age: '70-79 ára', count: 0 },
    { age: '80-89 ára', count: 0 },
    { age: '90+ ára', count: 0 },
];

export const ASSOCIATION_OF_THE_DYSLEXIC: string =
    '0fe8273c-2492-4508-8716-f9249e891aea';

export enum CompetitionTypes {
    SCHOOL = 'SCHOOL',
    COMPANY = 'COMPANY',
}
