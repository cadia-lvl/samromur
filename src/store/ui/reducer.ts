import { createReducer } from 'typesafe-actions';
import { UIState } from './state';
import * as uiActions from './actions';

const initialState: UIState = {
    notifications: [],
    showDemographics: true,
};

export default createReducer(initialState)
    .handleAction(uiActions.addNotification, (state, action) => {
        return {
            ...state,
            notifications: [...state.notifications, action.payload],
        };
    })
    .handleAction(uiActions.setShowDemographics, (state, action) => {
        return {
            ...state,
            showDemographics: action.payload,
        };
    });
