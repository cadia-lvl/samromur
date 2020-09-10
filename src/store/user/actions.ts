import {
  createAction,
  createAsyncAction
} from 'typesafe-actions';

import {
  Demographics,
  UserClient,
  UserConsents,
} from '../../types/user';

export const setDemographics = createAction(
  'SET_DEMOGRAPHICS',
)<Demographics>();

export const setClientId = createAction(
  'SET_CLIENT_ID',
)<string>();

export const setUserAgent = createAction(
  'SET_USER_AGENT',
)<string>();

export const setConsents = createAction(
  'SET_CONSENTS',
)<UserConsents>();

export const setCookieConsent = createAction(
  'SET_COOKIE_CONSENT',
)<boolean>();

export const setTermsConsent = createAction(
  'SET_TERMS_CONSENT',
)<boolean>();

export const setAuthenticated = createAction(
  'SET_AUTHENTICATED',
)<boolean>();

export const fetchUser = createAsyncAction(
  'UPDATE_USER_REQUEST',
  'UPDATE_USER_SUCCESS',
  'UPDATE_USER_FAILED',
)<{ isServer: boolean, id: string }, UserClient, string>();
