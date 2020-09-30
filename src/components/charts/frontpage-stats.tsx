import * as React from 'react';
import styled from 'styled-components';

import { averageClipSeconds } from '../../constants/stats';

const CTAStats = styled.div`
    margin: 1rem 0;
    width: 40rem;
    max-width: 100%;
    font-size: 1.3rem;
    text-align: center;
    display: flex;
    flex-direction: column;
`;

const Stat = styled.span`
    font-size: 2.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkerBlue};
`;

const SubStat = styled.span`
    & span {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.colors.darkerBlue};
        font-weight: 600;
    }
`;

interface Props {
    clients: number;
    clips: number;
}

export const FrontPageStats: React.FunctionComponent<Props> = ({ clients, clips }) => {
    const minutes = (clips * averageClipSeconds / 60);
    return (
        <CTAStats>
            <span>Saman höfum við lesið inn um</span>
            <Stat>
                {parseInt(minutes.toFixed(0)).toLocaleString('is').replace(',', '.')} mínútur
            </Stat>
            <SubStat>af íslensku eða um <span>{Math.round(minutes / 60)}</span> klukkustundir</SubStat>
        </CTAStats>
    );
}

export default FrontPageStats;