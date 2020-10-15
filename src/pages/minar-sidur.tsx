import * as React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";
import cookies from 'next-cookies';

import makeSSRDispatch from '../utilities/ssr-request';
import { fetchUser } from '../store/user/actions';

import Layout from '../components/layout/layout';
import DashboardSidePanel from '../components/dashboard/side-panel';
import DashboardStats from '../components/dashboard/stats';
import DashboardSettings from '../components/dashboard/settings';
import DashboardAdmin from '../components/dashboard/admin/admin';

const DashboardContainer = styled.div`
    width: 100%;
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
    padding: 1rem;
    display: grid;
    grid-template-columns: 11rem auto;
    gap: 1.5rem;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
        grid-template-rows: 5rem auto;
    }
`;

const SidePanel = styled(DashboardSidePanel)`
    border-right: 2px solid ${({ theme }) => theme.colors.borderGray};

    ${({ theme }) => theme.media.small} {
        flex-direction: row;
        border-right: none;
        border-bottom: 2px solid ${({ theme }) => theme.colors.borderGray};
    }
`;

const dispatchProps = {

}

interface DashboardPageProps {

}

type Props = ReturnType<typeof mapStateToProps> & DashboardPageProps & typeof dispatchProps & WithTranslation & WithRouterProps;

interface State {
    selected: string;
}

class DashboardPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selected: 'tolfraedi',
        }
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        const { store } = ctx;
        const allCookies = cookies(ctx);
        const { client_id } = allCookies;
        const clientId = client_id || store.getState().user.client.id;

        await makeSSRDispatch(ctx, fetchUser.request, { id: clientId });

        return ({
            namespacesRequired: ['common'],
        });
    }

    onSelect = (selected: string) => {
        this.setState({ selected });
    }

    render() {
        const { user } = this.props;
        const { selected } = this.state;
        return (
            <Layout>
                <DashboardContainer>
                    <SidePanel isAdmin={user.client.isAdmin} onSelect={this.onSelect} selected={selected} />
                    {
                        selected == 'tolfraedi' && <DashboardStats key={selected} client={user.client} />
                    }
                    {
                        selected == 'stillingar' && <DashboardSettings key={selected} />
                    }
                    {
                        selected == 'stjornandi' && <DashboardAdmin key={selected} />
                    }
                </DashboardContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation('common')(withRouter(DashboardPage)));