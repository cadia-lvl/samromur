import axios, { AxiosResponse, AxiosError } from 'axios';

import { UserState } from '../store/user/state';
import { Clip, ClipVote, WheelClip, UploadError } from '../types/samples';
import { SimpleSentence } from '../types/sentences';
import { SSRRequest } from '../types/ssr';
import { SimpleSentenceAndClips } from '../types/copy';

export interface FetchSamplesPayload extends SSRRequest {
    batch?: string;
    clientId?: string;
    age?: string;
    nativeLanguage?: string;
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
            age: payload.age && encodeURIComponent(payload.age),
            native_language:
                payload.nativeLanguage &&
                encodeURIComponent(payload.nativeLanguage),
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

export const fetchGroupedSentences = async (
    payload: FetchSamplesPayload
): Promise<Array<SimpleSentence[]>> => {
    const endpoint = `/api/contribute/sentences-group?count=${payload.count}`;
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
            console.log(response.data);
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });
};

/**
 * NOT FINISHED
 * api call that fetches the sentences and clips from the backend
 * @param payload
 */
export const fetchSentencesAndClips = async (
    payload: FetchSamplesPayload
): Promise<SimpleSentenceAndClips[]> => {
    /**
     * We need a new endpoint and url that contains the sentences and clips needed
     * for the tts-module
     */
    /*
    //doesn't work yet
    const endpoint = `/api/contribute/sentenceclips?count=${payload.count}`;
    const url = payload.host ? payload.host + endpoint : endpoint;
    return axios({
        method: 'GET',
        url,
        headers: {
            client_id: payload.clientId && encodeURIComponent(payload.clientId),
        },
    })
        .then((response: AxiosResponse) => {
            console.log('data:', response.data);
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error);
            return Promise.reject(error.code);
        });*/

    // Mock api until the new endpoint is implemented
    return [
        {
            id: '1',
            text: 'Þú þarft að fara út að leita',
            clip:
                'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good1.wav',
        },
        {
            id: '2',
            text: 'Allir verkir eru æi burt',
            clip:
                'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good2.wav',
        },
        {
            id: '3',
            text: 'Þetta er ekkert grín',
            clip:
                'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good3.wav',
        },
    ];
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

    const { age, gender, school } = demographics;

    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': recording.blob && recording.blob.type,
            age: encodeURIComponent(age.id),
            clip_id: clip.id,
            gender: encodeURIComponent(gender.id),
            institution: encodeURIComponent(school.code || ''),
            native_language: encodeURIComponent(demographics.nativeLanguage.id),
            sentence: encodeURIComponent(sentence.text),
            user_agent: encodeURIComponent(userAgent),
            sample_rate: recording.sampleRate,
            duration: recording.duration,
            size: recording.blob?.size,
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
