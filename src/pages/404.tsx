import { NextPageContext } from 'next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { withTranslation, WithTranslation } from '../server/i18n';
import Layout from '../components/layout/layout';

const Error404Container = styled.div`
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    margin-top: 2rem;
`;

type Props = WithTranslation;

export const Error404: FunctionComponent<Props> = (props) => {
    return (
        <Layout>
            <Error404Container>
                <h5>Síða fannst ekki</h5>
            </Error404Container>
        </Layout>
    );
};

export default withTranslation('common')(Error404);
