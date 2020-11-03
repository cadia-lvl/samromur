import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';
import * as statsActions from './actions';

export const fetchWeeklyClipsEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchWeeklyClips.request)),
        switchMap((action) =>
            from(api.stats.fetchWeeklyClips(action.payload)).pipe(
                map(statsActions.fetchWeeklyClips.success),
                catchError((message: string) =>
                    of(statsActions.fetchWeeklyClips.failure(message))
                )
            )
        )
    );

export const fetchWeeklyVotesEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchWeeklyVotes.request)),
        switchMap((action) =>
            from(api.stats.fetchWeeklyVotes(action.payload)).pipe(
                map(statsActions.fetchWeeklyVotes.success),
                catchError((message: string) =>
                    of(statsActions.fetchWeeklyVotes.failure(message))
                )
            )
        )
    );

export const fetchTotalClipsTimelineEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchTotalClipsTimeline.request)),
        switchMap((action) =>
            from(api.stats.fetchTotalClipsTimeline(action.payload)).pipe(
                map(statsActions.fetchTotalClipsTimeline.success),
                catchError((message: string) =>
                    of(statsActions.fetchTotalClipsTimeline.failure(message))
                )
            )
        )
    );

export const fetchTotalClipsEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchTotalClips.request)),
        switchMap((action) =>
            from(api.stats.fetchTotalClips(action.payload)).pipe(
                map(statsActions.fetchTotalClips.success),
                catchError((message: string) =>
                    of(statsActions.fetchTotalClips.failure(message))
                )
            )
        )
    );

export const fetchTotalValidatedClipsEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchTotalValidatedClips.request)),
        switchMap((action) =>
            from(api.stats.fetchTotalValidatedClips(action.payload)).pipe(
                map(statsActions.fetchTotalValidatedClips.success),
                catchError((message: string) =>
                    of(statsActions.fetchTotalValidatedClips.failure(message))
                )
            )
        )
    );

export const fetchTotalClipsClientsEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchTotalClipsClients.request)),
        switchMap((action) =>
            from(api.stats.fetchTotalClipsClients(action.payload)).pipe(
                map(statsActions.fetchTotalClipsClients.success),
                catchError((message: string) =>
                    of(statsActions.fetchTotalClipsClients.failure(message))
                )
            )
        )
    );

export const fetchTodayClipsEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(statsActions.fetchTodayClips.request)),
        switchMap((action) =>
            from(api.stats.fetchTodayClips(action.payload)).pipe(
                map(statsActions.fetchTodayClips.success),
                catchError((message: string) =>
                    of(statsActions.fetchTodayClips.failure(message))
                )
            )
        )
    );
