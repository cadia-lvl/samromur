import { createAction, createAsyncAction } from 'typesafe-actions';

import { UploadClipRequest } from '../../services/contribute-api';
import { Goal } from '../../types/contribute';

export const uploadClip = createAsyncAction(
    'UPLOAD_CLIP_REQUEST',
    'UPLOAD_CLIP_SUCCESS',
    'UPLOAD_CLIP_FAILED'
)<UploadClipRequest, undefined, string>();

export const resetContribute = createAction('RESET_CONTRIBUTE')();

export const setGoal = createAction('SET_GOAL')<Goal>();

export const setExpanded = createAction('SET_EXPANDED')<boolean>();

export const setGaming = createAction('SET_GAMING')<boolean>();

export const incrementProgress = createAction('INCREMENT_PROGRESS')();

export const decrementProgress = createAction('DECREMENT_PROGRESS')();
