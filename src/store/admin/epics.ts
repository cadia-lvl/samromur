import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';
import { confirmSentences, fetchAllSentencesInfo } from './actions';

export const fetchAllSentencesInfoEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(fetchAllSentencesInfo.request)),
        switchMap((action) =>
            from(api.admin.fetchAllSentencesInfo(action.payload)).pipe(
                map(fetchAllSentencesInfo.success),
                catchError((message: string) =>
                    of(fetchAllSentencesInfo.failure())
                ) // TO-DO: undefined hack
            )
        )
    );

export const confirmSentencesEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(confirmSentences.request)),
        switchMap((action) =>
            from(api.admin.confirmSentences(action.payload)).pipe(
                map(confirmSentences.success),
                catchError((message: string) =>
                    of(confirmSentences.failure(message))
                )
            )
        )
    );
