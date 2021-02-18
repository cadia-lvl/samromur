import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { averageClipSeconds } from '../../constants/stats';

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
    const hours = (clips * averageClipSeconds) / 3600;
    return (
        <CTAStats>
            <p>
                Til þess að tölvur og tæki skilji íslensku svo vel sé þá þarf
                mikinn fjölda upptaka af íslensku tali frá allskonar fólki. Þess
                vegna þurfum við þína aðstoð, með því að smella á „Taka þátt“ þá
                getur þú lesið upp nokkrar setningar og lagt „þína rödd” af
                mörkum. Við viljum sérstaklega hvetja fólk sem hefur íslensku
                sem annað mál að taka þátt. Það er á okkar valdi að alltaf megi
                finna svar á íslensku.
            </p>
            <p>
                Samrómur hófst í október 2019 og hingað til hafa um{' '}
                <Stat>{Math.ceil(clients / 1000)}</Stat> þúsund manns lesið
                rúmlega{' '}
                <Stat>
                    {parseInt(hours.toFixed(0))
                        .toLocaleString('is')
                        .replace(',', '.')}
                </Stat>{' '}
                klukkustundir eða{' '}
                <Stat>
                    {parseInt(clips.toFixed(0))
                        .toLocaleString('is')
                        .replace(',', '.')}
                </Stat>{' '}
                setningar. Hægt er að lesa meira um verkefnið hér.{' '}
                <Link href="/um">
                    <LinkText>Lesa meira hér.</LinkText>
                </Link>
            </p>
        </CTAStats>
    );
};

export default FrontPageStats;
