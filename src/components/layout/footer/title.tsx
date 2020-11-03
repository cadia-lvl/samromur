import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const TitleContainer = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 1fr 1fr;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.warmGray};

    & a:hover {
        color: ${({ theme }) => theme.colors.blue};
    }
`;

const NoSelectText = styled.div`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const Title = styled(NoSelectText)`
    font-size: 1.4rem;
    font-weight: 600;
`;

const License = styled.div`
    font-size: 0.7rem;
    & a {
        color: white;
    }
`;

interface Props {}

export const FooterTitle: React.FunctionComponent<Props> = (props) => {
    return (
        <TitleContainer>
            <Link href="/">
                <Title>Samrómur</Title>
            </Link>
            <License>
                Efni birt undir merkjum{' '}
                <a
                    target="_blank"
                    rel="noopener"
                    href="https://www.mozilla.org/en-US/foundation/licensing/website-content/"
                >
                    Creative Commons
                </a>
                .
            </License>
        </TitleContainer>
    );
};

export default FooterTitle;
