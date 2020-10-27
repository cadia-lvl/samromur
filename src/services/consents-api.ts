import axios, { AxiosResponse, AxiosError } from 'axios';

export const fetchConsent = async (kennitala: string): Promise<boolean> => {
    const url = `/api/consents/${kennitala}`;
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

export const sendEmail = async (kennitala: string, email: string): Promise<void> => {
    const url = `/api/consents/${kennitala}`;
    return axios({
        method: 'POST',
        url,
        headers: {
            email: encodeURIComponent(email),
        }
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}

export const addPermission = async (id: string): Promise<boolean> => {
    const url = `/api/consents/add/${id}`;
    return axios({
        method: 'POST',
        url,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error);
        return Promise.reject(error.code);
    });
}