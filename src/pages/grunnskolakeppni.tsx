import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import * as statsApi from '../services/stats-api';

// Components
import Layout from '../components/layout/layout';
import Leaderboard from '../components/competition/leaderboard';
import About from '../components/competition/about';

import {
    DefaultIndividualStats,
    DefaultSchoolStats,
    IndividualStat,
    SchoolStat,
} from '../types/competition';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
`;

const dispatchProps = {};

type Props = {
    individualLeaderboard: IndividualStat[];
    leaderboard: SchoolStat[];
} & ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

interface State {}

export const startTime = new Date(2021, 0, 18, 15, 0, 0, 0);
export const lastDay = new Date(2021, 0, 25, 0, 0, 0);
export const endTime = new Date(2021, 0, 26, 0, 0, 0);

class CompetitionPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        // If missing props fetch from db
        if (CompetitionPage.missingProps(ctx)) {
            // make SSRDispatch  calls to get competidion data
        }

        // TODO: only get data if not suspenseperiod.
        const { isServer, req } = ctx;

        const host = isServer && req ? 'http://' + req.headers.host : undefined;

        if (CompetitionPage.isFinalDay()) {
            return {
                namespacesRequired: ['common'],
                individualLeaderboard: DefaultIndividualStats,
                leaderboard: DefaultSchoolStats,
            };
        }

        const leaderboard = await statsApi.fetchLeaderboard({ host });
        const individualLeaderboard = await statsApi.fetchIndividualLeaderboard(
            { host }
        );
        return {
            namespacesRequired: ['common'],
            individualLeaderboard,
            leaderboard,
        };
    };

    static isFinalDay = (): boolean => {
        const now = new Date();

        return now >= lastDay && now <= endTime;
    };

    static missingProps = (ctx: NextPageContext): boolean => {
        const { store } = ctx;
        return false;
        // check if data not found in localstorage//state
    };

    // TODO: Move Title here
    // TODO: Move Countdown here
    render() {
        const { individualLeaderboard, leaderboard } = this.props;
        return (
            <Layout>
                <CompetitionPageContainer>
                    <Leaderboard
                        individualStats={individualLeaderboard}
                        stats={leaderboard}
                    />
                    <About />
                </CompetitionPageContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    stats: state.stats,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation('common')(withRouter(CompetitionPage)));
