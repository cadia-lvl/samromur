import { createReducer } from 'typesafe-actions';
import { ContributeState } from './state';
import * as ContributeActions from './actions';

import { speakGoals } from '../../constants/packages';
import { ContributeType } from '../../types/contribute';

const initialState: ContributeState = {
    expanded: false,
    gaming: false,
    progress: 0,
    totalSpoken: 0,
    totalVerified: 0,
    hasPlayedRepeatClip: false,
};

export default createReducer(initialState)
    /*     .handleAction(
        ContributeActions.uploadClip.request,
        (state) => state
    )
    .handleAction(
        ContributeActions.uploadClip.success,
        (state, action) => {
            return state
        }
    )
    .handleAction(
        ContributeActions.uploadClip.failure,
        (state, action) => {
            return state
        }
    ) */
    .handleAction(ContributeActions.setGoal, (state, action) => {
        return {
            ...state,
            goal: action.payload,
        };
    })
    .handleAction(ContributeActions.setGaming, (state, action) => {
        return {
            ...state,
            gaming: action.payload,
        };
    })
    .handleAction(ContributeActions.setHasPlayedRepeatClip, (state, action) => {
        return {
            ...state,
            hasPlayedRepeatClip: action.payload,
        };
    })

    .handleAction(ContributeActions.resetContribute, (state, action) => {
        return {
            ...initialState,
            gaming: state.gaming,
            totalSpoken: state.totalSpoken,
            totalVerified: state.totalVerified,
        };
    })
    .handleAction(ContributeActions.setExpanded, (state, action) => {
        return {
            ...state,
            expanded: action.payload,
        };
    })
    .handleAction(ContributeActions.incrementProgress, (state, action) => {
        const addToSpoken =
            state.goal && state.goal.contributeType !== ContributeType.LISTEN;
        return {
            ...state,
            progress: state.progress + 1,
            totalSpoken: state.totalSpoken + (addToSpoken ? 1 : 0),
            totalVerified: state.totalVerified + (addToSpoken ? 0 : 1),
        };
    })
    .handleAction(ContributeActions.decrementProgress, (state, action) => {
        const removeFromSpoken =
            state.goal && state.goal.contributeType !== ContributeType.LISTEN;
        return {
            ...state,
            progress: state.progress - 1,
            totalSpoken: state.totalSpoken - (removeFromSpoken ? 1 : 0),
            totalVerified: state.totalVerified - (removeFromSpoken ? 0 : 1),
        };
    });
