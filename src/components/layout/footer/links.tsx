import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useTranslation } from '../../../server/i18n';

const Links = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.warmGray};

    & a:hover {
        color: ${({ theme }) => theme.colors.blue};
    }
`;

interface Props {}

export const FooterLinks: React.FunctionComponent<Props> = (props) => {
    const { t } = useTranslation(['footer']);
    return (
        <Links>
            <Link href="/personuverndaryfirlysing">
                <a>{t('privacy-policy')}</a>
            </Link>
            <Link href="/vafrakokustefna">
                <a>{t('cookies')}</a>
            </Link>
            <Link href="/skilmalar">
                <a>{t('terms')}</a>
            </Link>
            <a rel="noopener" href="mailto:samromur@ru.is">
                {t('contact')}
            </a>
        </Links>
    );
};

export default FooterLinks;
