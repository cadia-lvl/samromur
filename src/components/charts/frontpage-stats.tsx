import * as React from 'react';
import styled from 'styled-components';

const HeroChart = styled.div`
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
    -moz-box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
    -webkit-box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
`;

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
    font-size: 2.5rem;
    font-weight: 600;
`;

const SubStat = styled.span`
    font-size: 1.2rem;
    & span {
        font-size: 1.5rem;
        font-weight: 600;
    }
`;

interface Props {
    clients: number;
    clips: number;
}

const averageClipSeconds = 5.24; // Average seconds from first 100k confirmed clips

export const FrontPageStats: React.FunctionComponent<Props> = ({ clients, clips }) => {
    const minutes = (clips * averageClipSeconds / 60);
    return (
        <CTAStats>
            <span>Saman höfum við lesið inn um</span>
            <Stat>
                {parseInt(minutes.toFixed(0)).toLocaleString('is').replace(',', '.')}
            </Stat>
            <span>mínútur af setningum á íslensku</span>
            <SubStat>
                eða <span>{Math.round(minutes / 60)}</span> klukkustundir
            </SubStat>
        </CTAStats>
    );
}

export default FrontPageStats;