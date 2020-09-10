import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';

import { Subject } from 'rxjs'
import { ActionsObservable, StateObservable } from 'redux-observable'
import rootEpic from '../store/root-epic';
import services from '../services';

import { fetchClips, FetchSamplesPayload } from '../services/contribute-api';
import { setDemographics, setClientId } from '../store/user/actions';
import { fetchWeeklyVotes } from '../store/stats/actions';
import { Clip, ClipVote, WheelClip } from '../types/samples';
import { resetContribute } from '../store/contribute/actions';

import { saveVote, SaveVoteRequest } from '../services/contribute-api';

import ContributePage from '../components/contribute/setup/contribute';

const dispatchProps = {
    resetContribute
}

interface InitialProps {
    initialClips: Clip[];
}

type Props = ReturnType<typeof mapStateToProps> & InitialProps & typeof dispatchProps & WithTranslation;

interface State {

}

const sentencesChunkSize = 20;

class SpeakPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    static async getInitialProps(ctx: NextPageContext) {
        const { isServer, req, res, store } = ctx;
        const fetchRequest: FetchSamplesPayload = {
            clientId: req?.headers.client_id as string || '',
            count: sentencesChunkSize,
            isServer,
        }
        store.dispatch(resetContribute())
        const state$ = new StateObservable(new Subject(), store.getState())
        const action$ = ActionsObservable.of(fetchWeeklyVotes.request(isServer));
        const resultAction = await rootEpic(
            action$,
            state$,
            services
        ).toPromise();

        store.dispatch(resultAction);

        const initialClips = await fetchClips(fetchRequest);

        return ({
            namespacesRequired: ['common'],
            initialClips,
        });
    }

    vote = async (clip: WheelClip): Promise<number> => {
        if (!clip.id || !clip.vote) {
            return Promise.reject();
        } else {
            const payload = {
                clipId: clip.id,
                vote: clip.vote,
                voteId: clip.voteId
            }
            return saveVote(payload);
        }
    }

    render() {
        const { initialClips } = this.props;

        return (
            <ContributePage clips={initialClips} />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation('common')(SpeakPage));