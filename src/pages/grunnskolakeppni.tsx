import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

// Components
import Layout from '../components/layout/layout';

const dispatchProps = {};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

class CompetitionPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        // If missing props fetch from db
        if (CompetitionPage.missingProps(ctx)) {
            // make SSRDispatch  calls to get competidion data
        }

        return {
            namespacesRequired: ['common'],
        };
    };

    static missingProps = (ctx: NextPageContext): boolean => {
        const { store } = ctx;
        return false;
        // check if data not found in localstorage//state
    };

    render() {
        return (
            <Layout>
                <p>Grunnskolakeppni</p>
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
