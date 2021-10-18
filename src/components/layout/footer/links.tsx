import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useTranslation } from '../../../server/i18n';

const Links = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.white};
    /* margin: auto; */
    margin-right: 1rem;

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
            {/* <a rel="noopener" href="mailto:samromur@ru.is">
                {t('contact')}
            </a> */}
        </Links>
    );
};

export default FooterLinks;
