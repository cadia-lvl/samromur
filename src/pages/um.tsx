import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/layout';
import Why from '../components/about/why';
import Partners from '../components/about/partners';

const AboutPageContainer = styled.div`
    min-height: 100%;
    width: 100%;
    background: url(/images/wave-footer@3x.png) no-repeat bottom;
    background-size: 100% auto;
    padding: 1.5rem;
`;

const ContentContainer = styled.div`
    width: 100%;
    height: 100%;
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

interface Props {}

class AboutPage extends React.Component<Props> {
    static getInitialProps = async ({ store, isServer }: NextPageContext) => {
        return {
            namespacesRequired: ['common'],
        };
    };

    render() {
        return (
            <Layout white>
                {/* <AboutPageContainer> */}
                <ContentContainer>
                    <Why />
                    <Partners />
                </ContentContainer>
                {/* </AboutPageContainer> */}
            </Layout>
        );
    }
}

export default AboutPage;
