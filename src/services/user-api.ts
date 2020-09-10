import axios, { AxiosResponse, AxiosError } from 'axios';

import {
    UserClient
} from '../types/user';

const serverPrefix = 'http://localhost:9000';

export const fetchUser = async (payload: { isServer: boolean, id: string }): Promise<UserClient> => {
    const endpoint = `/api/users`;
    const url = payload.isServer ? serverPrefix + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
        headers: {
            client_id: encodeURIComponent(payload.id),
        }
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}