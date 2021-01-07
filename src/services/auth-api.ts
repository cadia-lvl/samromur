import axios, { AxiosResponse, AxiosError } from 'axios';
import { error } from 'console';
import { response } from 'express';
import { async } from 'rxjs/internal/scheduler/async';
import password from '../pages/api/users/password';

import { AuthRequest, AuthError } from '../types/auth';

export const signUp = async (payload: AuthRequest): Promise<string> => {
    const { email, password } = payload;

    const endpoint = '/api/users/signup';
    const auth = Buffer.from(`${email}:${password}`, 'utf8').toString('base64');

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as string);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.response?.data as keyof AuthError);
        });
};

export const login = async (payload: AuthRequest): Promise<string> => {
    const { email, password } = payload;

    const endpoint = '/api/users/login';
    const auth = Buffer.from(`${email}:${password}`, 'utf8').toString('base64');

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.response?.data as keyof AuthError);
        });
};

export const changePassword = async (
    oldPassword: string,
    newPassword: string
): Promise<void> => {
    const url = `/api/users/password`;
    const auth = Buffer.from(`${oldPassword}:${newPassword}`, 'utf8').toString(
        'base64'
    );

    return axios({
        method: 'POST',
        url,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

/**
 * Post a request to the api to create a reset password token
 * for the imput email.
 * @param email the email of the user
 */
export const createResetToken = async (email: string): Promise<void> => {
    const url = `/api/users/forgot-password`;
    const auth = Buffer.from(`${email}`, 'utf8').toString('base64');

    return axios({
        method: 'POST',
        url,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.log(error);
            return Promise.reject(error.code);
        });
};

/**
 * Posts a request to the api to reset the password of the
 * user with the reset password token.
 * @param token the reset password token of the user
 * @param password the new password
 */
export const resetPassword = async (
    token: string,
    password: string
): Promise<boolean> => {
    const url = `api/users/reset-password`;
    const auth = Buffer.from(`${token}:${password}`, 'utf8').toString('base64');

    return axios({
        method: 'POST',
        url,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
        .then((response: AxiosResponse) => {
            return Promise.resolve(true);
        })
        .catch((error: AxiosError) => {
            console.log(error);
            return Promise.reject(error.code);
        });
};

export const logout = async () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
};

export const logoutRedirectTo = async (path: string) => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.pathname = path;
};
