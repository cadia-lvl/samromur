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
    font-size: 2.5 rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkerBlue};
`;

const SubStat = styled.span`
    font-size: 1.8 rem;
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 600;

`;

interface Props {
    clients: number;
    clips: number;
}

export const FrontPageStats: React.FunctionComponent<Props> = ({ clients, clips }) => {
    const minutes = (clips * averageClipSeconds / 60); 
    return (
        <CTAStats>
            <p>Til þess að tölvur og tæki skilji íslensku svo vel sé þá þarf mikinn fjölda upptaka af íslensku tali 
               frá allskonar fólki. Þess vegna þurfum við þína aðstoð, með því að smella á „Taka þátt“ þá getur þú lesið 
               upp nokkrar setningar og lagt „þína rödd” af mörkum. Við viljum sérstaklega hvetja fólk sem hefur íslensku
               sem annað mál að taka þátt.

            </p>
            <p>
            Samrómur hófst í október 2019 og hingað til hafa um  <Stat>10</Stat> þúsund manns lesið   
            rúmlega <Stat>{parseInt(minutes.toFixed(0)).toLocaleString('is').replace(',', '.')}</Stat> mínútur 
            eða <Stat>{clips}</Stat> setningar. Hægt er að lesa meira um verkefnið  
            hér. <SubStat>Lesa meira hér [add route here].</SubStat>
            </p>
        </CTAStats>
    );
};

export default FrontPageStats;
