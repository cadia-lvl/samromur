import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';

import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import { fetchWeeklyClips } from '../store/stats/actions';
import { resetContribute } from '../store/contribute/actions';

import { fetchSentences } from '../services/contribute-api';
import { WheelSentence } from '../types/sentences';

import makeSSRDispatch from '../utilities/ssr-request';

import ContributePage from '../components/contribute/setup/contribute';

const dispatchProps = {
    resetContribute,
};

interface InitialProps {
    initialSentences: WheelSentence[];
}

type Props = ReturnType<typeof mapStateToProps> &
    InitialProps &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

interface State {
    demographic: boolean;
}

const sentencesChunkSize = 20;

class SpeakPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            demographic: false,
        };
    }

    static async getInitialProps(ctx: NextPageContext) {
        const { isServer, req, store } = ctx;

        // Reset session progress
        store.dispatch(resetContribute());

        // Fetch some stats to display at the end of the session
        makeSSRDispatch(ctx, fetchWeeklyClips.request);

        // Fetch sentences to prompt the user with
        const host = isServer && req ? 'http://' + req.headers.host : undefined;
        const initialSentences = await fetchSentences({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            host,
        });

        return {
            namespacesRequired: ['common'],
            initialSentences,
        };
    }

    onDemographicsSubmit = () => {
        this.setState({ demographic: true });
    };

    render() {
        const { initialSentences } = this.props;

        return <ContributePage sentences={initialSentences} />;
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
