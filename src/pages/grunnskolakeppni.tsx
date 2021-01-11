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
import { SchoolStat } from '../types/competition';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;

    & h2 {
        margin-bottom: 2rem;
    }
`;

const dispatchProps = {};

type Props = {
    leaderboard: SchoolStat[];
} & ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

interface State {
    
}

class CompetitionPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            
        }
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        // If missing props fetch from db
        if (CompetitionPage.missingProps(ctx)) {
            // make SSRDispatch  calls to get competidion data
        }

        const { isServer, req } = ctx;

        const host = isServer && req ? 'http://' + req.headers.host : undefined;
        const leaderboard = await statsApi.fetchLeaderboard({ host });

        return {
            namespacesRequired: ['common'],
            leaderboard
        };
    };

    static missingProps = (ctx: NextPageContext): boolean => {
        const { store } = ctx;
        return false;
        // check if data not found in localstorage//state
    };

    render() {
        const { leaderboard } = this.props;
        return (
            <Layout>
                <CompetitionPageContainer>
                    <h2>Grunnskólakeppni grunnskólanna fyrir skóla</h2>
                    <p>Hér er stigatafla o.fl.</p>
                    <Leaderboard stats={leaderboard || []} />
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
