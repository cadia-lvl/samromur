import axios, { AxiosResponse, AxiosError } from 'axios';

import { UserState } from '../store/user/state';
import { Clip, ClipVote, WheelClip, UploadError } from '../types/samples';
import { SimpleSentence } from '../types/sentences';
import { SSRRequest } from '../types/ssr';

export interface FetchSamplesPayload extends SSRRequest {
    batch?: string;
    clientId?: string;
    count: number;
}

export const fetchSentences = async (
    payload: FetchSamplesPayload
): Promise<SimpleSentence[]> => {
    const endpoint = `/api/contribute/sentences?count=${payload.count}`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
        headers: {
            client_id: payload.clientId && encodeURIComponent(payload.clientId),
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

export const fetchClips = async (
    payload: FetchSamplesPayload
): Promise<Clip[]> => {
    const endpoint = `/api/contribute/clips?count=${payload.count}`;
    const url = payload.host ? payload.host + endpoint : endpoint;

    return axios({
        method: 'GET',
        url,
        headers: {
            client_id: payload.clientId && encodeURIComponent(payload.clientId),
            batch: payload.batch ? encodeURIComponent(payload.batch) : '',
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

export interface UploadClipRequest {
    clip: WheelClip;
    user: UserState;
}

export const uploadClip = async (
    clip: WheelClip,
    user: UserState
): Promise<number> => {
    const endpoint = '/api/contribute/upload';

    if (!clip.recording) {
        return Promise.reject(UploadError.NO_RECORDING);
    }

    const { recording, sentence } = clip;
    const { demographics, userAgent } = user;

    const { age, gender } = demographics;

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': recording.blob && recording.blob.type,
            age: encodeURIComponent(age.id),
            clip_id: clip.id,
            gender: encodeURIComponent(gender.id),
            native_language: encodeURIComponent('islenska'),
            sentence: encodeURIComponent(sentence.text),
            user_agent: encodeURIComponent(userAgent),
        },
        data: recording.blob,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error.message);
            return Promise.reject(error.code);
        });
};

export interface SaveVoteRequest {
    clipId: number;
    isSuper: boolean;
    vote: ClipVote;
    voteId?: number;
}

export const saveVote = async (payload: SaveVoteRequest): Promise<number> => {
    const endpoint = '/api/contribute/vote';

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            clip_id: payload.clipId,
            is_super: encodeURIComponent(payload.isSuper),
            vote: encodeURIComponent(payload.vote as string),
            vote_id: payload.voteId && payload.voteId,
        },
    })
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            console.error(error.message);
            return Promise.reject(error.code);
        });
};
