import axios, { AxiosResponse, AxiosError } from 'axios';
import { TimelineStat, TimelineSumStat } from '../types/stats';

const serverPrefix = 'http://localhost:9000';

export interface FetchSamplesPayload {
    clientId?: string;
    count: number;
    isServer?: boolean;
}

export const fetchWeeklyClips = async (isServer?: boolean): Promise<TimelineStat[]> => {
    const endpoint = `/api/stats/weekly?type=tala`;
    const url = isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}

export const fetchWeeklyVotes = async (isServer?: boolean): Promise<TimelineStat[]> => {
    const endpoint = `/api/stats/weekly?type=hlusta`;
    const url = isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}

export const fetchTotalClipsTimeline = async (isServer?: boolean): Promise<TimelineSumStat[]> => {
    const endpoint = `/api/stats/clips/timeline`;
    const url = isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}

export const fetchTotalClipsClients = async (isServer?: boolean): Promise<number> => {
    const endpoint = `/api/stats/clips/clients`;
    const url = isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}

export const fetchTotalClips = async (isServer?: boolean): Promise<number> => {
    const endpoint = `/api/stats/clips/total`;
    const url = isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}

export const fetchTodayClips = async (isServer?: boolean): Promise<number> => {
    const endpoint = `/api/stats/clips/today`;
    const url = isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}