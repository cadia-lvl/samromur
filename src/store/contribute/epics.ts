import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';
import { uploadClip } from './actions';

export const uploadClipEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(uploadClip.request)),
        switchMap((action) =>
            from(
                api.contribute.uploadClip(
                    action.payload.clip,
                    action.payload.user
                )
            ).pipe(
                map(uploadClip.success),
                catchError((message: string) => of(uploadClip.failure(message)))
            )
        )
    );
