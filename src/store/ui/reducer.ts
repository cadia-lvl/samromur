import { createReducer } from 'typesafe-actions';
import { UIState } from './state';
import * as uiActions from './actions';

const initialState: UIState = {
    notifications: [],
};

export default createReducer(initialState).handleAction(
    uiActions.addNotification,
    (state, action) => {
        return {
            ...state,
            notifications: [...state.notifications, action.payload],
        };
    }
);
