import * as React from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from '../server/i18n';

import Layout from '../components/layout/layout';
import MarkdownArticle from '../components/text/md-article';

const PrivacyPolicyContainer = styled.div`

`;

type Props = WithTranslation;

class PrivacyPolicy extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static getInitialProps = async () => {
        return ({
            namespacesRequired: ['documents'],
        });
    }

    render() {
        const cookies = this.props.t('cookies');
        return (
            <Layout>
                <PrivacyPolicyContainer>
                    <MarkdownArticle text={cookies} />
                </PrivacyPolicyContainer>
            </Layout>
        );
    }
}

export default withTranslation('documents')(PrivacyPolicy);