import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';

import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import {
    fetchWeeklyClips,
    fetchWeeklyRepeatedClips,
} from '../store/stats/actions';
import { resetContribute } from '../store/contribute/actions';

import {
    fetchClipsToRepeat,
    fetchGroupedSentences,
    fetchSentences,
} from '../services/contribute-api';
import { WheelSentence } from '../types/sentences';

import makeSSRDispatch from '../utilities/ssr-request';

import ContributePage from '../components/contribute/setup/contribute';
import { AgeGroups, AgeLimit } from '../utilities/demographics-age-helper';
import { ContributeType } from '../types/contribute';
import { Clip } from '../types/samples';

const dispatchProps = {
    resetContribute,
};

export interface AllGroupsSentences {
    [key: string]: WheelSentence[];
}

interface InitialProps {
    initialSentences: AllGroupsSentences;
    initialClips: Clip[];
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

        // ---------------- UNCOMMENT THIS FOR TALA --------------- //
        // Fetch some stats to display at the end of the session
        makeSSRDispatch(ctx, fetchWeeklyClips.request);
        makeSSRDispatch(ctx, fetchWeeklyRepeatedClips.request);

        //Fetch Adult sentences to prompt the user with
        // const host = isServer && req ? 'http://' + req.headers.host : undefined;
        // const initialSentencesGrouped = await fetchGroupedSentences({
        //     clientId: (req?.headers.client_id as string) || '',
        //     count: sentencesChunkSize,
        //     host,
        // });

        // const initialSentences: AllGroupsSentences = {};
        // initialSentences[AgeGroups.ADULTS] = initialSentencesGrouped[0];
        // initialSentences[AgeGroups.TEENAGERS] = initialSentencesGrouped[1];
        // initialSentences[AgeGroups.CHILDREN] = initialSentencesGrouped[2];

        // const initialSentences = await fetchSentences({
        //     clientId: (req?.headers.client_id as string) || '',
        //     count: 20,
        //     host,
        // });

        return {
            namespacesRequired: ['common'],
            // initialSentences,
        };

        // ---------------- UNCOMMENT THIS FOR HERMA --------------- //
        // // Fetch some stats to display at the end of the session
        // await makeSSRDispatch(ctx, fetchWeeklyRepeatedClips.request);

        // // Fetch clips to prompt the user with
        // const host = isServer && req ? 'http://' + req.headers.host : undefined;
        // const initialClips = await fetchClipsToRepeat({
        //     clientId: (req?.headers.client_id as string) || '',
        //     count: sentencesChunkSize,
        //     host,
        // });

        // return {
        //     initialClips,
        // };
    }

    onDemographicsSubmit = () => {
        this.setState({ demographic: true });
    };

    render() {
        // const { initialSentences } = this.props;
        // const { initialClips } = this.props;

        return (
            <ContributePage
                // groupedSentences={initialSentences}
                contributeType={ContributeType.SPEAK}
                // clipsToRepeat={initialClips}
                // contributeType={ContributeType.REPEAT}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    user: state.user,
    stats: state.stats,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation('common')(withRouter(SpeakPage)));
