import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../server/i18n';

import Layout from '../components/layout/layout';
import MarkdownArticle from '../components/text/md-article';
import privacyENG from '../../public/static/locales/eng/privacy-policy.md';
import privacyISL from '../../public/static/locales/isl/privacy-policy.md';
import { useEffect } from 'react';

const PrivacyPolicyContainer = styled.div``;

const PrivacyPolicy: React.FunctionComponent = () => {
    const { i18n } = useTranslation();
    const [policy, setPolicy] = React.useState('');

    useEffect(() => {
        i18n.language === 'isl' ? setPolicy(privacyISL) : setPolicy(privacyENG);
    });

    return (
        <Layout>
            <PrivacyPolicyContainer>
                <MarkdownArticle text={policy} />
            </PrivacyPolicyContainer>
        </Layout>
    );
};

export default PrivacyPolicy;
