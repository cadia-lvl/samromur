import axios, { AxiosResponse, AxiosError } from 'axios';

import {
    SentenceBatch,
    SentenceBatchResponse,
    SentenceGroupInfo,
} from '../types/sentences';

import { SSRRequest } from '../types/ssr';

export const confirmSentences = async (id: string): Promise<boolean> => {
    const endpoint = '/api/admin/sentences/confirm'
    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            id: encodeURIComponent(id),
        }
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        return Promise.reject(error.code);
    });
}

export const uploadSentences = async (batch: SentenceBatch): Promise<SentenceBatchResponse> => {
    const endpoint = '/api/admin/sentences/upload';
    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': 'text/plain',
            name: encodeURIComponent(batch.name),
        },
        data: batch.file.text,
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        console.error(error.message);
        return Promise.reject(error.code);
    });
}

export const fetchAllSentencesInfo = async (payload: SSRRequest): Promise<Array<SentenceGroupInfo>> => {
    const endpoint = '/api/admin/sentences';
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url
    }).then((response: AxiosResponse) => {
        return response.data;
    }).catch((error: AxiosError) => {
        return Promise.reject(error.code);
    })
}