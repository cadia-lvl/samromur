import { NextPageContext } from 'next';

import { Subject } from 'rxjs'
import { ActionsObservable, StateObservable } from 'redux-observable'
import rootEpic from '../store/root-epic';
import services from '../services';
import { PayloadAction } from 'typesafe-actions';

/**
 * Dispatch an action within getInitialProps 
 * 
 * @param ctx
 * @param action 
 * @param payload
 */
export const makeSSRDispatch = async (
    ctx: NextPageContext,
    action: (payload?: any, host?: string) => PayloadAction<any, any>,
    payload?: { [key: string]: any },
): Promise<void> => {
    const { isServer, req, store } = ctx;

    // If this is a server side rendered request, host needs to be the same as in the req object
    const host = (isServer && req) ? 'http://' + req.headers.host as string : undefined;
    if (payload) {
        payload.host = host;
    } else {
        payload = {
            host
        }
    }

    const state$ = new StateObservable(new Subject(), store.getState());
    const action$ = ActionsObservable.of(action(payload));
    const resultAction = await rootEpic(
        action$,
        state$,
        services
    ).toPromise();

    store.dispatch(resultAction);
}

export default makeSSRDispatch;