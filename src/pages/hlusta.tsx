import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';

import { fetchClips } from '../services/contribute-api';
import { fetchWeeklyVotes } from '../store/stats/actions';
import { Clip, WheelClip } from '../types/samples';
import { resetContribute } from '../store/contribute/actions';

import makeSSRDispatch from '../utilities/ssr-request';

import { saveVote } from '../services/contribute-api';

import ContributePage from '../components/contribute/setup/contribute';
import { ContributeType } from '../types/contribute';

const dispatchProps = {
    resetContribute,
};

interface InitialProps {
    initialClips: Clip[];
}

type Props = ReturnType<typeof mapStateToProps> &
    InitialProps &
    typeof dispatchProps &
    WithTranslation;

interface State {}

const sentencesChunkSize = 20;

class SpeakPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    static async getInitialProps(ctx: NextPageContext) {
        const { isServer, req, res, store } = ctx;

        // Reset session progress
        store.dispatch(resetContribute());

        // Fetch some stats to display at the end of the session
        makeSSRDispatch(ctx, fetchWeeklyVotes.request);

        // Fetch clips to prompt the user with
        const host = isServer && req ? 'http://' + req.headers.host : undefined;
        const initialClips = await fetchClips({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            host,
        });

        return {
            namespacesRequired: ['common'],
            initialClips,
        };
    }

    render() {
        const { initialClips } = this.props;

        return (
            <ContributePage
                contributeType={ContributeType.LISTEN}
                clips={initialClips}
            />
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
