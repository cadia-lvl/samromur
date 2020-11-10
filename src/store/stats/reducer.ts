import { createReducer } from 'typesafe-actions';
import { StatsState } from './state';
import * as StatsActions from './actions';

const initialState: StatsState = {
    todayClips: 0,
    totalClips: 0,
    totalValidatedClips: 0,
    totalClipsClients: 0,
    totalClipsTimeline: [],
    weekly: {
        clips: [],
        votes: [],
    },
};

export default createReducer(initialState)
    .handleAction(StatsActions.fetchWeeklyClips.success, (state, action) => {
        return {
            ...state,
            weekly: {
                ...state.weekly,
                clips: action.payload,
            },
        };
    })
    .handleAction(StatsActions.fetchWeeklyVotes.success, (state, action) => {
        return {
            ...state,
            weekly: {
                ...state.weekly,
                votes: action.payload,
            },
        };
    })
    .handleAction(
        StatsActions.fetchTotalClipsTimeline.success,
        (state, action) => {
            return {
                ...state,
                totalClipsTimeline: action.payload,
            };
        }
    )
    .handleAction(StatsActions.fetchTotalClips.success, (state, action) => {
        return {
            ...state,
            totalClips: action.payload,
        };
    })
    .handleAction(
        StatsActions.fetchTotalValidatedClips.success,
        (state, action) => {
            return {
                ...state,
                totalValidatedClips: action.payload,
            };
        }
    )
    .handleAction(
        StatsActions.fetchTotalClipsClients.success,
        (state, action) => {
            return {
                ...state,
                totalClipsClients: action.payload,
            };
        }
    )
    .handleAction(StatsActions.fetchTodayClips.success, (state, action) => {
        return {
            ...state,
            todayClips: action.payload,
        };
    });
