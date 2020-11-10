import { createReducer } from 'typesafe-actions';
import { AdminState } from './state';
import { SentenceGroupInfo } from '../../types/sentences';
import * as AdminActions from './actions';

const initialState: AdminState = {
    sentences: [],
};

export default createReducer(initialState)
    .handleAction(AdminActions.confirmSentences.request, (state) => state)
    .handleAction(AdminActions.confirmSentences.success, (state) => state)
    .handleAction(AdminActions.confirmSentences.failure, (state) => state)
    .handleAction(AdminActions.fetchAllSentencesInfo.request, (state) => state)
    .handleAction(
        AdminActions.fetchAllSentencesInfo.success,
        (state, action) => {
            return {
                ...state,
                sentences: action.payload,
            };
        }
    )
    .handleAction(AdminActions.fetchAllSentencesInfo.failure, (state) => state);
