import {
  createAction,
  createAsyncAction
} from 'typesafe-actions';

import {
  SentenceGroupInfo,
  SentenceBatch,
  SentenceBatchResponse } from '../../types/sentences';

export const confirmSentences = createAsyncAction(
  'CONFIRM_SENTENCES_REQUEST',
  'CONFIRM_SENTENCES_SUCCESS',
  'CONFIRM_SENTENCES_FAILED',
)<string, boolean, string>();

export const fetchAllSentencesInfo = createAsyncAction(
  'FETCH_ALL_SENTENCES_INFO_REQUEST',
  'FETCH_ALL_SENTENCES_INFO_SUCCESS',
  'FETCH_ALL_SENTENCES_INFO_FAILED',
)<boolean, Array<SentenceGroupInfo>, undefined>(); // TO-DO: undefined hack