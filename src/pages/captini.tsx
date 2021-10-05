import { NextPageContext } from 'next';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';

import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import { fetchWeeklyClips } from '../store/stats/actions';
import { resetContribute, setGoal } from '../store/contribute/actions';

import { SimpleSentence } from '../types/sentences';

import makeSSRDispatch from '../utilities/ssr-request';

import ContributePage from '../components/contribute/setup/contribute';
import { ContributeType, Goal } from '../types/contribute';
import styled from 'styled-components';

const CaptiniHeader = styled.h1`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
`;

const dispatchProps = {
    resetContribute,
};

interface InitialProps {
    initialSentences: Array<SimpleSentence>;
}

type Props = ReturnType<typeof mapStateToProps> &
    InitialProps &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

interface State {
    demographic: boolean;
}

class CaptiniPage extends React.Component<Props, State> {
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

        const goal: Goal = {
            contributeType: ContributeType.SPEAK,
            name: 'Captini 100',
            text: '',
            count: 100,
        };
        // Set goal for captini
        store.dispatch(setGoal(goal));

        // Fetch some stats to display at the end of the session
        makeSSRDispatch(ctx, fetchWeeklyClips.request);

        return {
            namespacesRequired: ['common'],
        };
    }

    onDemographicsSubmit = () => {
        this.setState({ demographic: true });
    };

    render() {
        return (
            <div>
                <CaptiniHeader>Captini</CaptiniHeader>
                <ContributePage
                    sentencesSource="captini"
                    contributeType={ContributeType.SPEAK}
                />
            </div>
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
)(withTranslation('common')(withRouter(CaptiniPage)));
