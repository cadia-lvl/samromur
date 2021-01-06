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
import { AgeGroups } from '../utilities/demographics-age-helper';

const dispatchProps = {
    resetContribute,
};

export interface AllGroupsSentences {
    [key: string]: WheelSentence[];
}

interface InitialProps {
    initialSentences: AllGroupsSentences;
}

type Props = ReturnType<typeof mapStateToProps> &
    InitialProps &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

interface State {
    demographic: boolean;
}

enum AgeLimit {
    KIDS = '10',
    TEENS = '15',
    ADULT = '20',
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

        // Fetch Adult sentences to prompt the user with
        const host = isServer && req ? 'http://' + req.headers.host : undefined;
        const initialSentencesAdult = await fetchSentences({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            age: AgeLimit.ADULT,
            host,
        });

        // Fetch Teen sentences to promt the user with
        const initialSentencesTeen = await fetchSentences({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            age: AgeLimit.TEENS,
            host,
        });

        // Fetch kids sentences to promt the user with
        const initialSentencesKids = await fetchSentences({
            clientId: (req?.headers.client_id as string) || '',
            count: sentencesChunkSize,
            age: AgeLimit.KIDS,
            host,
        });

        const initialSentences: AllGroupsSentences = {};
        initialSentences[AgeGroups.ADULTS] = initialSentencesAdult;
        initialSentences[AgeGroups.TEENAGERS] = initialSentencesTeen;
        initialSentences[AgeGroups.CHILDREN] = initialSentencesKids;

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

        return <ContributePage goupedSentences={initialSentences} />;
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
