import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import { withTranslation, WithTranslation } from '../server/i18n';
import Layout from '../components/layout/layout';

const ErrorContainer = styled.div`
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    margin-top: 2rem;
`;

interface ErrorProps {
    statusCode: number;
}

type Props = WithTranslation & ErrorProps;

class Error extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static async getInitialProps({
        res,
        err,
        store,
        isServer,
    }: NextPageContext) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
        return {
            namespacesRequired: ['common'],
            statusCode,
        };
    }

    render() {
        const { statusCode } = this.props;
        return (
            <Layout>
                <ErrorContainer>
                    <h5>
                        {statusCode
                            ? `Úps, ${statusCode} villa á vefþjóni!`
                            : 'Úps, villa í vafra!'}
                    </h5>
                </ErrorContainer>
            </Layout>
        );
    }
}

export default Error;
