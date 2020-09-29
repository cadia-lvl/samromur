import axios, { AxiosResponse, AxiosError } from 'axios';

import { UserClient } from '../types/user';
import { SSRRequest } from '../types/ssr';

export interface FetchUserRequest extends SSRRequest {
    id: string;
}

export const fetchUser = async (payload: FetchUserRequest): Promise<UserClient> => {
    const endpoint = `/api/users`;
    const url = payload.host ? payload.host + endpoint : endpoint;
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