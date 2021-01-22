import axios, { AxiosResponse, AxiosError } from 'axios';
import { TimelineStat, TimelineSumStat } from '../types/stats';

import { SSRRequest } from '../types/ssr';
import { IndividualStat, SchoolStat } from '../types/competition';

export const fetchWeeklyClips = async (
    payload: SSRRequest
): Promise<TimelineStat[]> => {
    const endpoint = `/api/stats/weekly?type=tala`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchWeeklyVotes = async (
    payload: SSRRequest
): Promise<TimelineStat[]> => {
    const endpoint = `/api/stats/weekly?type=hlusta`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchTotalClipsTimeline = async (
    payload: SSRRequest
): Promise<TimelineSumStat[]> => {
    const endpoint = `/api/stats/clips/timeline`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchTotalClipsClients = async (
    payload: SSRRequest
): Promise<number> => {
    const endpoint = `/api/stats/clips/clients`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchTotalClips = async (payload: SSRRequest): Promise<number> => {
    const endpoint = `/api/stats/clips/total`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchTotalValidatedClips = async (
    payload: SSRRequest
): Promise<number> => {
    const endpoint = `/api/stats/clips/total-validated`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchTodayClips = async (payload: SSRRequest): Promise<number> => {
    const endpoint = `/api/stats/clips/today`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchLeaderboard = async (
    payload: SSRRequest
): Promise<SchoolStat[]> => {
    const endpoint = `/api/stats/clips/competition/leaderboard`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchIndividualLeaderboard = async (
    payload: SSRRequest
): Promise<IndividualStat[]> => {
    const endpoint = `/api/stats/clips/competition/individual-leaderboard`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

export const fetchAgeGenderStats = async (): Promise<any> => {
    const endpoint = `/api/stats/age-gender`;
    return axios({
        method: 'GET',
        url: endpoint,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};
