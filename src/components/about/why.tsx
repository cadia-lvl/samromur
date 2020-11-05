import * as React from 'react';
import styled from 'styled-components';

const WhyContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 2rem;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
    }
`;

const WhyInformation = styled.div`
    display: flex;
    flex-direction: column;
`;

const WhyTitle = styled.h1``;

const WhyParagraph = styled.p``;

const WhyImage = styled.img`
    width: 100%;
    height: auto;

    ${({ theme }) => theme.media.small} {
        display: none;
    }
`;

const StyledLink = styled.a`
    color: ${({ theme }) => theme.colors.blue};
    :visited,
    :focus {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blue};
    }

    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blackOlive};
    }
`;

interface Props {}

export const Why: React.FunctionComponent<Props> = (props) => {
    return (
        <WhyContainer>
            <WhyInformation>
                <WhyTitle>Af hverju?</WhyTitle>
                <WhyParagraph>
                    Á síðstu árum hefur verið bylting í raddtækni og því hvernig
                    við notum röddina til þess að stjórna tækninni. Íslenskan á
                    undir högg að sækja vegna þeirra öru tæknibreytinga en mörg
                    okkar eiga nú þegar samskipti við tölvur og ýmis tæki á
                    erlendu máli. Fólk mun nota röddina í auknum mæli til að
                    stýra hvers kyns tækjum og tólum en vandinn er sá að tækin
                    skilja ekki íslensku.
                </WhyParagraph>
                <WhyParagraph>
                    Þess vegna er mikilvægt að missa ekki af lestinni og nú er
                    hafin vinna við stórt samstarfsverkefni til þess að gera
                    íslensku gjaldgenga í tölvum og tækjum. Að því koma
                    íslenskir háskólar, stofnanir, fyrirtæki og félagasamtök,
                    sem munu á næstu árum þróa nauðsynlega innviði fyrir
                    hugbúnað sem skilur og talar íslensku. Samrómur verður hluti
                    af þessu verkefni, opið gagnasafn raddsýna fyrir íslensku
                    sem hver sem getur notað til þess að þróa sínar
                    máltæknilausnir. Með þessu tryggjum við öryggi íslenskunnar
                    á stafrænum tímum.
                </WhyParagraph>
                <WhyParagraph>
                    Lesa má meira um máltækni áætlun íslands{' '}
                    <StyledLink
                        target={'blank'}
                        href={
                            'https://www.stjornarradid.is/lisalib/getfile.aspx?itemid=56f6368e-54f0-11e7-941a-005056bc530c'
                        }
                    >
                        hér
                    </StyledLink>
                    .
                </WhyParagraph>
            </WhyInformation>
            <WhyImage src={'./images/robot@3x.png'} alt="Robot-with-people" />
        </WhyContainer>
    );
};

export default Why;
