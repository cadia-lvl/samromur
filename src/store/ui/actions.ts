import { createAction } from 'typesafe-actions';

import { UINotification } from '../../types/ui';

export const addNotification = createAction(
    'ADD_NOTIFICATION'
)<UINotification>();

export const setShowDemographics = createAction(
    'SET_SHOW_DEMOGRAPHICS'
)<boolean>();
