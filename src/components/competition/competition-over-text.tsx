import Link from 'next/link';
import * as React from 'react';
import styled from 'styled-components';
import * as colors from './ui/colors';

const StyledLink = styled.a`
    color: white;
    font-weight: bold;
    cursor: pointer;

    :visited {
        text-decoration: none;
    }

    :focus,
    :hover {
        text-decoration: none;
        color: ${colors.purple1};
    }
`;

export const CompetitionOverText = () => {
    return (
        <>
            <p>Takk fyrir að Redda málinu!</p>
            <p>
                Vinnustaðakeppninni Reddum málinu er nú lokið. Við þökkum
                frábærar viðtökur, sá ótrúlegi fjöldi raddsýna sem að safnaðist
                frá allskonar fólki mun nýtast íslenskunni vel og hjálpa henni
                að vera betur í stakk búinn til að fylgja tækniþróun heimsins.
                Íslenskan þakkar fyrir ykkar framlag.
            </p>
            <p>
                Við hvetjum alla til að halda áfram upplestri og leggja
                raddgagnasafni Samróms liðsinni sína á{' '}
                <Link href={'https://samromur.is'} passHref>
                    <StyledLink>Samrómur</StyledLink>
                </Link>
            </p>
            {/* <p>
                <Link href={'https://almannaromur.is'} passHref>
                    <StyledLink>Almannarómur</StyledLink>
                </Link>
                ,{' '}
                <Link href={'https://www.ru.is/'} passHref>
                    <StyledLink>HR</StyledLink>
                </Link>
                {' og '}
                <Link href={'https://siminn.is'} passHref>
                    <StyledLink>Síminn</StyledLink>
                </Link>
            </p> */}
        </>
    );
};
