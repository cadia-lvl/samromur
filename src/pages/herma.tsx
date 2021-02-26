import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import Contribute from '../components/contribute/setup/contribute';
import { fetchSentencesAndClips } from '../services/contribute-api';
import { resetContribute } from '../store/contribute/actions';
import { ContributeType } from '../types/contribute';
import makeSSRDispatch from '../utilities/ssr-request';

const dispatchProps = {
    resetContribute,
};

const sentencesChunkSize = 20;

class RepeatPage extends React.Component {
    static async getInitialProps(ctx: NextPageContext) {
        const { isServer, req, res, store } = ctx;

        // Reset session progress
        store.dispatch(resetContribute());

        // // Fetch some stats to display at the end of the session
        // makeSSRDispatch(ctx, fetchWeeklyClips.request);

        // Fetch clips to prompt the user with
        const host = isServer && req ? 'http://' + req.headers.host : undefined;
        const initialClips = await fetchSentencesAndClips({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            host,
        });

        return {
            initialClips,
        };
    }

    render() {
        return <Contribute contributeType={ContributeType.REPEAT} />;
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(RepeatPage);
