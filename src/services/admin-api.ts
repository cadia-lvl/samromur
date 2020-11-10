import axios, { AxiosResponse, AxiosError } from 'axios';

import {
    SentenceBatch,
    SentenceBatchResponse,
    SentenceGroupInfo,
} from '../types/sentences';

import { SSRRequest } from '../types/ssr';
import { Demographics, SuperUserStat } from '../types/user';

export const confirmSentences = async (id: string): Promise<boolean> => {
    const endpoint = '/api/admin/sentences/confirm';
    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            id: encodeURIComponent(id),
        },
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.code);
        });
};

export const uploadSentences = async (
    batch: SentenceBatch
): Promise<SentenceBatchResponse> => {
    const endpoint = '/api/admin/sentences/upload';
    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': 'text/plain',
            name: encodeURIComponent(batch.name),
        },
        data: batch.file.text,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error.message);
            return Promise.reject(error.code);
        });
};

export const fetchAllSentencesInfo = async (
    payload: SSRRequest
): Promise<Array<SentenceGroupInfo>> => {
    const endpoint = '/api/admin/sentences';
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.code);
        });
};

export const makeSuperUser = async (userEmail: string): Promise<void> => {
    const url = '/api/admin/users/update';
    return axios({
        method: 'POST',
        url,
        headers: {
            email: encodeURIComponent(userEmail),
        },
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.code);
        });
};

export const fetchSuperUsers = async (): Promise<SuperUserStat[]> => {
    const url = '/api/admin/users/fetch-stats';
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.code);
        });
};

export const fetchVerificationLabels = async (): Promise<string[]> => {
    const url = '/api/admin/upload/fetch-verification-labels';
    return axios({
        method: 'GET',
        url,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.code);
        });
};

export const uploadVerificationBatch = async (
    files: File[],
    age: string,
    dialect: string,
    gender: string,
    nativeLanguage: string,
    label: string,
    onUploadProgress: (ev: ProgressEvent) => void
): Promise<number> => {
    const url = '/api/upload-batch';

    let formData: FormData = new FormData();
    files.forEach((file: File) =>
        file.type.startsWith('audio')
            ? formData.append('audio', file)
            : formData.append('metadata', file)
    );

    return axios({
        method: 'POST',
        url,
        headers: {
            'Content-Type': 'multipart/form-data',
            age: encodeURIComponent(age),
            dialect: encodeURIComponent(dialect),
            gender: encodeURIComponent(gender),
            native_language: encodeURIComponent(nativeLanguage),
            status: encodeURIComponent(label),
        },
        data: formData,
        onUploadProgress,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error.code);
        });
};
