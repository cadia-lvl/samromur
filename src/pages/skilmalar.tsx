import * as React from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from '../server/i18n';

import Layout from '../components/layout/layout';
import MarkdownArticle from '../components/text/md-article';

const TermsContainer = styled.div`

`;

type Props = WithTranslation;

class Terms extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static getInitialProps = async () => {
        return ({
            namespacesRequired: ['documents'],
        });
    }

    render() {
        const terms = this.props.t('terms');
        return (
            <Layout>
                <TermsContainer>
                    <MarkdownArticle text={terms} />
                </TermsContainer>
            </Layout>
        );
    }
}

export default withTranslation('documents')(Terms);