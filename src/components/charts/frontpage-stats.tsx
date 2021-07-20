import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { averageClipSeconds } from '../../constants/stats';
import { useTranslation } from '../../server/i18n';
import { Trans } from 'react-i18next';

const CTAStats = styled.div`
    margin: 1rem 0;
    width: 50rem;
    max-width: 100%;
    font-size: 1.3rem;
    text-align: center;
    display: flex;
    flex-direction: column;
`;

const Stat = styled.span`
    font-size: 2.5 rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkerBlue};
`;

const LinkText = styled.span`
    font-size: 2.5 rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkerBlue};
    cursor: pointer;

    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blackOlive};
    }
`;

const SubStat = styled.a`
    font-size: 1.8 rem;
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 600;
    cursor: pointer;
`;

interface Props {
    clients: number;
    clips: number;
}

export const FrontPageStats: React.FunctionComponent<Props> = ({
    clients,
    clips,
}) => {
    const hours = Math.round((averageClipSeconds * clips) / 3600);
    const hoursFixed = parseInt(hours.toFixed(0))
        .toLocaleString('is')
        .replace(/,/g, '.');
    const thousandsClients = Math.ceil(clients / 1000);
    const clipsString = parseInt(clips.toFixed(0))
        .toLocaleString('is')
        .replace(/,/g, '.');
    const { t } = useTranslation(['home']);

    return (
        <CTAStats>
            <p>{t('the-why')}</p>
            <p>
                <Trans i18nKey="background" t={t}>
                    Samrómur hófst í október 2019 og hingað til hafa um{' '}
                    <Stat>{{ thousands: thousandsClients }}</Stat> þúsund manns
                    lesið rúmlega <Stat>{{ hours: hoursFixed }}</Stat>{' '}
                    klukkustundir eða <Stat>{{ sentences: clipsString }}</Stat>{' '}
                    setningar. Hægt er að lesa meira um verkefnið hér.{' '}
                </Trans>
                <Link href="/um">
                    <LinkText>{t('read-more')}</LinkText>
                </Link>
            </p>
        </CTAStats>
    );
};

export default FrontPageStats;
