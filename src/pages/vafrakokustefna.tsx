import * as React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/layout';
import MarkdownArticle from '../components/text/md-article';
import { useTranslation } from '../server/i18n';
import cookiesENG from '../../public/static/locales/eng/cookies.md';
import cookiesISL from '../../public/static/locales/isl/cookies.md';
import { useEffect } from 'react';

const CookiesContainer = styled.div``;

const PrivacyPolicy: React.FunctionComponent = () => {
    const { i18n } = useTranslation('documents');
    const [cookies, setCookies] = React.useState('');

    useEffect(() => {
        // Update the md file depending on the language
        i18n.language === 'isl'
            ? setCookies(cookiesISL)
            : setCookies(cookiesENG);
    }, [i18n.language]);

    return (
        <Layout>
            <CookiesContainer>
                <MarkdownArticle text={cookies} />
            </CookiesContainer>
        </Layout>
    );
};

export default PrivacyPolicy;
