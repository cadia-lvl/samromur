import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/layout';

const DatasetPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
`;

interface Props {

}

class DatasetPage extends React.Component<Props> {

    static getInitialProps = async ({ store, isServer }: NextPageContext) => {
        return ({
            namespacesRequired: ['common'],
        });
    }

    render() {
        return (
            <Layout>
                <DatasetPageContainer>
                    <h5>Um gagnasafnið</h5>
                </DatasetPageContainer>
            </Layout>
        );
    }
}

export default DatasetPage;