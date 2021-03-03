import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import Contribute from '../components/contribute/setup/contribute';
import { fetchClipsToRepeat } from '../services/contribute-api';
import { resetContribute } from '../store/contribute/actions';
import { ContributeType } from '../types/contribute';
import { Clip } from '../types/samples';
import makeSSRDispatch from '../utilities/ssr-request';

const dispatchProps = {
    resetContribute,
};

const sentencesChunkSize = 20;

interface Props {
    initialClips: Clip[];
}

class RepeatPage extends React.Component<Props> {
    static async getInitialProps(ctx: NextPageContext) {
        const { isServer, req, res, store } = ctx;

        // Reset session progress
        store.dispatch(resetContribute());

        // // Fetch some stats to display at the end of the session
        // makeSSRDispatch(ctx, fetchWeeklyClips.request);

        // Fetch clips to prompt the user with
        const host = isServer && req ? 'http://' + req.headers.host : undefined;
        const initialClips = await fetchClipsToRepeat({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            host,
        });

        return {
            initialClips,
        };
    }

    render() {
        const { initialClips } = this.props;
        return (
            <Contribute
                clipsToRepeat={initialClips}
                contributeType={ContributeType.REPEAT}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(RepeatPage);
