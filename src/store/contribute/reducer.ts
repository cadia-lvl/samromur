import { createReducer } from 'typesafe-actions';
import { ContributeState } from './state';
import * as ContributeActions from './actions';

import { speakGoals } from '../../constants/packages';

const initialState: ContributeState = {
    expanded: false,
    gaming: false,
    progress: 0,
    totalSpoken: 0,
    totalVerified: 0,
}

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
    .handleAction(
        ContributeActions.setGoal,
        (state, action) => {
            return {
                ...state,
                goal: action.payload
            }
        }
    )
    .handleAction(
        ContributeActions.setGaming,
        (state, action) => {
            return {
                ...state,
                gaming: action.payload
            }
        }
    )
    .handleAction(
        ContributeActions.resetContribute,
        (state, action) => {
            return {
                ...initialState,
            }
        }
    )
    .handleAction(
        ContributeActions.setExpanded,
        (state, action) => {
            return {
                ...state,
                expanded: action.payload
            }
        }
    )
    .handleAction(
        ContributeActions.incrementProgress,
        (state, action) => {
            return {
                ...state,
                progress: state.progress + 1,
            }
        }
    )
    .handleAction(
        ContributeActions.decrementProgress,
        (state, action) => {
            return {
                ...state,
                progress: state.progress - 1,
            }
        }
    )