import { createAction, createAsyncAction } from 'typesafe-actions';

import { TimelineStat, TimelineSumStat } from '../../types/stats';

export const fetchWeeklyClips = createAsyncAction(
  'FETCH_WEEKLY_CLIPS_REQUEST',
  'FETCH_WEEKLY_CLIPS_SUCCESS',
  'FETCH_WEEKLY_CLIPS_FAILED',
)<boolean, TimelineStat[], string>();

export const fetchWeeklyVotes = createAsyncAction(
  'FETCH_WEEKLY_VOTES_REQUEST',
  'FETCH_WEEKLY_VOTES_SUCCESS',
  'FETCH_WEEKLY_VOTES_FAILED',
)<boolean, TimelineStat[], string>();

export const fetchTotalClipsTimeline = createAsyncAction(
  'FETCH_TOTAL_CLIPS_TIMELINE_REQUEST',
  'FETCH_TOTAL_CLIPS_TIMELINE_SUCCESS',
  'FETCH_TOTAL_CLIPS_TIMELINE_FAILED',
)<boolean, TimelineSumStat[], string>();

export const fetchTotalClips = createAsyncAction(
  'FETCH_TOTAL_CLIPS_REQUEST',
  'FETCH_TOTAL_CLIPS_SUCCESS',
  'FETCH_TOTAL_CLIPS_FAILED',
)<boolean, number, string>();

export const fetchTotalClipsClients = createAsyncAction(
  'FETCH_TOTAL_CLIPS_CLIENTS_REQUEST',
  'FETCH_TOTAL_CLIPS_CLIENTS_SUCCESS',
  'FETCH_TOTAL_CLIPS_CLIENTS_FAILED',
)<boolean, number, string>();

export const fetchTodayClips = createAsyncAction(
  'FETCH_TODAY_CLIPS_REQUEST',
  'FETCH_TODAY_CLIPS_SUCCESS',
  'FETCH_TODAY_CLIPS_FAILED',
)<boolean, number, string>();