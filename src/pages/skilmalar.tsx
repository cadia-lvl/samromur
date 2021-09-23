import * as React from 'react';
import styled from 'styled-components';
import { useTranslation, WithTranslation } from '../server/i18n';

import Layout from '../components/layout/layout';
import MarkdownArticle from '../components/text/md-article';

import termsENG from '../../public/static/locales/eng/terms.md';
import termsISL from '../../public/static/locales/isl/terms.md';
import { useEffect } from 'react';

const TermsContainer = styled.div``;

type Props = WithTranslation;

const Terms: React.FunctionComponent<Props> = () => {
    const { i18n } = useTranslation();
    const [termsText, setTermsText] = React.useState('');

    useEffect(() => {
        // Update the md file depending on the language
        i18n.language === 'isl'
            ? setTermsText(termsISL)
            : setTermsText(termsENG);
    }, [i18n.language]);

    return (
        <Layout>
            <TermsContainer>
                <MarkdownArticle text={termsText} />
            </TermsContainer>
        </Layout>
    );
};

export default Terms;
