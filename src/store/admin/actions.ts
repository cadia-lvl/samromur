import { createAsyncAction } from 'typesafe-actions';

import { SentenceGroupInfo } from '../../types/sentences';
import { SSRRequest } from '../../types/ssr';

export const confirmSentences = createAsyncAction(
    'CONFIRM_SENTENCES_REQUEST',
    'CONFIRM_SENTENCES_SUCCESS',
    'CONFIRM_SENTENCES_FAILED'
)<string, boolean, string>();

export const fetchAllSentencesInfo = createAsyncAction(
    'FETCH_ALL_SENTENCES_INFO_REQUEST',
    'FETCH_ALL_SENTENCES_INFO_SUCCESS',
    'FETCH_ALL_SENTENCES_INFO_FAILED'
)<SSRRequest, Array<SentenceGroupInfo>, undefined>(); // TO-DO: undefined hack
