import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/layout';

const ThankYouPageContainer = styled.div`
    padding-top: 5rem;
`;

interface Props {

}

class ThankYouPage extends React.Component<Props> {

    static getInitialProps = async ({ store, isServer }: NextPageContext) => {
        return ({
            namespacesRequired: ['common'],
        });
    }

    render() {
        return (
            <Layout>
                <ThankYouPageContainer>

                </ThankYouPageContainer>
            </Layout>
        );
    }
}

export default ThankYouPage;