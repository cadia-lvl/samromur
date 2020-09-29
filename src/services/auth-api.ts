import axios, { AxiosResponse, AxiosError } from 'axios';

import { AuthRequest, AuthError } from '../types/auth';

export const signUp = async (payload: AuthRequest): Promise<string> => {
    const { email, password } = payload;

    const endpoint = '/api/users/signup';
    const auth = Buffer.from(`${email}:${password}`, 'utf8').toString('base64');

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Authorization': `Basic ${auth}`,
        }
    }).then((response: AxiosResponse) => {
        return Promise.resolve(response.data as string);
    }).catch((error: AxiosError) => {
        return Promise.reject(error.response?.data as keyof AuthError);
    });
}

export const login = async (payload: AuthRequest): Promise<void> => {
    const { email, password } = payload;

    const endpoint = '/api/users/login';
    const auth = Buffer.from(`${email}:${password}`, 'utf8').toString('base64');

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Authorization': `Basic ${auth}`,
        }
    }).then((response: AxiosResponse) => {
        return Promise.resolve();
    }).catch((error: AxiosError) => {
        return Promise.reject(error.response?.data as keyof AuthError);
    });
}

export const logout = async () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
}