import axios, { AxiosResponse, AxiosError } from 'axios';
import { ScoreboardData } from '../types/competition';
import { Institution } from '../types/institution';

export const signUpCompany = () => {
    return true;
};

export const companyExists = async (company: string) => {
    const url = '/api/competition/company-exists';

    try {
        const response: AxiosResponse = await axios.get(url, {
            headers: { company: company },
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
    email: string
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
