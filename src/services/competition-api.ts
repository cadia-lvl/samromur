import axios, { AxiosResponse, AxiosError } from 'axios';
import {
    AgeStat,
    GenderStat,
    ScoreboardData,
    TimelineStat,
} from '../types/competition';
import { Institution } from '../types/institution';

export const signUpCompany = () => {
    return true;
};

export const companyExists = async (company: string, kennitala: string) => {
    const url = '/api/competition/company-exists';

    try {
        const response: AxiosResponse = await axios.get(url, {
            headers: { company: company, kt: kennitala },
        });
        return response.data;
    } catch (error) {
        return Promise.reject();
    }
};

export const addCompany = async (
    company: string,
    size: string,
    contact: string,
    email: string,
    kennitala: string
) => {
    const url = '/api/competition/add-company';

    try {
        const response: AxiosResponse = await axios.post(
            url,
            {},
            {
                headers: {
                    company: encodeURIComponent(company),
                    size: encodeURIComponent(size),
                    contact: encodeURIComponent(contact),
                    email: encodeURIComponent(email),
                    kennitala: encodeURIComponent(kennitala),
                },
            }
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCompanies = async (): Promise<Institution[]> => {
    const url = '/api/competition/get-companies';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as Institution[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCompetitionScores = async () => {
    const url = '/api/competition/get-scoreboard';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as ScoreboardData[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCompetitionTimeline = async () => {
    const url = '/api/competition/get-timeline';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as TimelineStat[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCompetitionGenderStats = async () => {
    const url = '/api/competition/get-gender-stats';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as GenderStat[]; // [{gender, count}, {gender, count}, {gender, count}]
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCompetitionAgeStats = async () => {
    const url = '/api/competition/get-age-stats';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as AgeStat; // [{age, count}, ...]
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPreCompetitionScores = async () => {
    const url = '/api/competition/get-pre-scoreboard';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as ScoreboardData[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPreCompetitionTimeline = async () => {
    const url = '/api/competition/get-pre-timeline';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as TimelineStat[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPreCompetitionGenderStats = async () => {
    const url = '/api/competition/get-pre-gender-stats';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as GenderStat[]; // [{gender, count}, {gender, count}, {gender, count}]
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPreCompetitionAgeStats = async () => {
    const url = '/api/competition/get-pre-age-stats';

    try {
        const response: AxiosResponse = await axios.get(url);
        return response.data as AgeStat; // [{age, count}, ...]
    } catch (error) {
        return Promise.reject(error);
    }
};
