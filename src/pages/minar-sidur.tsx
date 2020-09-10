import { NextPageContext } from 'next';
import * as React from 'react';

import Layout from '../components/layout/layout';

interface Props {

}

class DashboardPage extends React.Component<Props> {

    static getInitialProps = async ({ store, isServer }: NextPageContext) => {
        return ({
            namespacesRequired: ['common'],
        });
    }
    render() {
        return (
            <Layout>
                <p>Velkominn á dashboard.</p>
            </Layout>
        );
    }
}

export default DashboardPage;