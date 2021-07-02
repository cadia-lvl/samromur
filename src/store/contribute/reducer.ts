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
    totalRepeated: 0,
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
            totalRepeated: state.totalRepeated,
        };
    })
    .handleAction(ContributeActions.setExpanded, (state, action) => {
        return {
            ...state,
            expanded: action.payload,
        };
    })
    .handleAction(ContributeActions.incrementProgress, (state, action) => {
        const { isSpeak, isListen, isRepeat } = getContributeType(state);
        return {
            ...state,
            progress: state.progress + 1,
            totalSpoken: state.totalSpoken + (isSpeak ? 1 : 0),
            totalVerified: state.totalVerified + (isListen ? 1 : 0),
            totalRepeated: state.totalRepeated + (isRepeat ? 1 : 0),
        };
    })
    .handleAction(ContributeActions.decrementProgress, (state, action) => {
        const { isSpeak, isListen, isRepeat } = getContributeType(state);
        return {
            ...state,
            progress: state.progress - 1,
            totalSpoken: state.totalSpoken - (isSpeak ? 1 : 0),
            totalVerified: state.totalVerified - (isListen ? 1 : 0),
            totalRepeated: state.totalRepeated - (isRepeat ? 1 : 0),
        };
    });

// Helper function for the increment/decrement functions to find the contribute type
const getContributeType = (
    state: ContributeState
): { isSpeak: boolean; isListen: boolean; isRepeat: boolean } => {
    const isSpeak = !!(
        state.goal && state.goal.contributeType == ContributeType.SPEAK
    );
    const isListen = !!(
        state.goal && state.goal.contributeType == ContributeType.LISTEN
    );
    const isRepeat = !!(
        state.goal && state.goal.contributeType == ContributeType.REPEAT
    );

    return { isSpeak, isListen, isRepeat };
};
