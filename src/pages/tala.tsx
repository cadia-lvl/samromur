import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";
import { Subject } from 'rxjs'
import { ActionsObservable, StateObservable } from 'redux-observable'
import rootEpic from '../store/root-epic';
import services from '../services';

import { fetchSentences, FetchSamplesPayload } from '../services/contribute-api';
import { fetchWeeklyClips } from '../store/stats/actions';
import { SimpleSentence, WheelSentence } from '../types/sentences';

import { resetContribute } from '../store/contribute/actions';

import ContributePage from '../components/contribute/setup/contribute';


const dispatchProps = {
    resetContribute
}

interface InitialProps {
    initialSentences: WheelSentence[];
}

type Props = ReturnType<typeof mapStateToProps> & InitialProps & typeof dispatchProps & WithTranslation & WithRouterProps;

interface State {
    demographic: boolean;
}

const sentencesChunkSize = 20;

class SpeakPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            demographic: false,
        }
    }

    static async getInitialProps(ctx: NextPageContext) {
        const { isServer, req, res, store } = ctx;
        store.dispatch(resetContribute())

        const state$ = new StateObservable(new Subject(), store.getState())
        const action$ = ActionsObservable.of(fetchWeeklyClips.request(isServer));
        const resultAction = await rootEpic(
            action$,
            state$,
            services
        ).toPromise();

        store.dispatch(resultAction);

        const initialSentences = await fetchSentences({
            clientId: req?.headers.client_id as string || '',
            count: sentencesChunkSize,
            isServer,
        });

        return ({
            namespacesRequired: ['common'],
            initialSentences,
        });
    }

    onDemographicsSubmit = () => {
        this.setState({ demographic: true });
    }

    render() {
        const { initialSentences } = this.props;

        return (
            <ContributePage sentences={initialSentences} />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation('common')(withRouter(SpeakPage)));