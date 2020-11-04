import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

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
    return (
        <Links>
            <Link href="/personuverndaryfirlysing">
                <a>Persónuvernd</a>
            </Link>
            <Link href="/vafrakokustefna">
                <a>Vafrakökur</a>
            </Link>
            <Link href="/skilmalar">
                <a>Skilmálar</a>
            </Link>
            <a rel="noopener" href="mailto:samromur@ru.is">
                Hafa samband
            </a>
        </Links>
    );
};

export default FooterLinks;
