export interface SchoolStat {
    institution: string;
    count: number;
    users: number;
    rank: number;
}

export interface IndividualStat {
    institution: string;
    count: number;
    username: string;
}

export interface FunromurIndividualStat {
    email: string;
    count: number;
}

const DefaultSchoolStat: SchoolStat = {
    institution: '',
    count: 0,
    users: 0,
    rank: 0,
};

const DefaultIndividualStat: IndividualStat = {
    institution: '',
    count: 0,
    username: '',
};

export interface ScoreboardData {
    rank: number;
    name: string;
    size: string;
    users: number;
    count: number;
}

export interface AgeStat {
    age: string;
    count: number;
}

export interface GenderStat {
    gender: string;
    count: number;
}

export interface TimelineStat {
    date: string;
    count: number;
}

export const DefaultSchoolStats: SchoolStat[] = [DefaultSchoolStat];
export const DefaultIndividualStats: IndividualStat[] = [DefaultIndividualStat];
