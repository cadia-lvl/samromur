import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';
import { fetchUser, } from './actions';

export const fetchUserEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = (action$, state$, { api }) =>
        action$.pipe(
            filter(isActionOf(fetchUser.request)),
            switchMap(action =>
                from(api.user.fetchUser(action.payload)).pipe(
                    map(fetchUser.success),
                    catchError((message: string) => of(fetchUser.failure(message)))
                )
            )
        );