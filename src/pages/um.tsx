import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/layout';

const AboutPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
`;

interface Props {

}

class AboutPage extends React.Component<Props> {

    static getInitialProps = async ({ store, isServer }: NextPageContext) => {
        return ({
            namespacesRequired: ['common'],
        });
    }

    render() {
        return (
            <Layout>
                <AboutPageContainer>
                    <h5>Um Samróm</h5>
                </AboutPageContainer>
            </Layout>
        );
    }
}

export default AboutPage;