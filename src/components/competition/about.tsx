import * as React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 50rem;
    margin: 0 auto;
    margin-top: 4rem;
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`;

const Paragraph = styled.p`
    & span {
        font-weight: 600;
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

const AboutCompetition: React.FunctionComponent<Props> = () => {
    return (
        <AboutContainer id="um">
            <TitleContainer>
                <h2>Um keppnina</h2>
            </TitleContainer>
            <Paragraph>
                Lestrarkeppni á milli grunnskóla landsins verður haldin í annað
                sinn þar sem keppt verður um fjölda setninga sem nemendur lesa
                inn í Samróm. Forseti Íslands mun setja keppnina formlega af
                stað í Fellaskóla mánudaginn <span>18.janúar</span> en setningu
                keppninnar verður streymt í beinni á{' '}
                <StyledLink
                    target={'blank'}
                    href={'https://www.facebook.com/samromur'}
                >
                    Facebook-síðu Samróms
                </StyledLink>
                . Keppnin stendur yfir í viku og lýkur <span>25. janúar</span>.
            </Paragraph>
            <Paragraph>
                Þessi keppni er haldin til þess að hvetja til þátttöku í
                verkefninu Samrómur sem snýr að því að safna upptökum af lestri
                sem notaður verður til þess að kenna tölvum og tækjum að skilja
                íslensku, hægt er að lesa meira{' '}
                <StyledLink target={'blank'} href={'/um'}>
                    hér
                </StyledLink>
                . Viðtökur við síðustu keppni voru stórkostlegar en{' '}
                <span>1430</span> manns tóku þátt fyrir hönd <span>130</span>{' '}
                skóla og lásu í kringum <span>144</span> þúsund setningar.
            </Paragraph>
            <Paragraph>
                Allir geta tekið þátt og lesið fyrir sinn skóla með því að
                smella{' '}
                <StyledLink target={'blank'} href={'/tala'}>
                    hér
                </StyledLink>
                , biðja um leyfi foreldris/forráðamanns (hafi það ekki þegar
                verið gert), velja sinn skóla og lesa svo inn setningar sem
                vefurinn birtir. Staða keppninnar er síðan birt jafnóðum í
                stigatöflu sem verður aðgengileg á þessari síðu. Allir geta
                tekið þátt og því eru foreldrar og starfsmenn ekki síður hvattir
                til þess að lesa inn fyrir skólana. Hægt er að prófa að taka
                þátt núna en einungis munu upptökur sem koma inn eftir að keppni
                hefst telja til keppninnar.
            </Paragraph>
            <Paragraph>
                Keppnin í ár verður með sama sniði og í fyrra þó með þeirri
                breytingu að í ár verða þrír flokkar í stað tveggja og verða
                veitt verðlaun fyrir fyrsta sætið í hverjum flokki. Notast er
                við gögn frá Hagstofunni um fjölda nemenda sem og gögn frá
                keppninni í fyrra þegar skólum er raðað í flokka. Hver
                vinningsskóli mun fá <span>3 Sphero bolts</span> vélmenni en
                vélmennin tengja saman leik og forritunarkennslu og eru hönnuð
                til að ýta undir forvitni, sköpun og nýjar uppgötvanir. Hér er
                hægt að lesa nánar um{' '}
                <StyledLink
                    target={'blank'}
                    href={'https://www.epli.is/aukahlutir/leikir/sphero-bolt/'}
                >
                    Sphero Bolt
                </StyledLink>
            </Paragraph>
            <Paragraph>
                Til að rifja upp stemmninguna er{' '}
                <StyledLink
                    target={'blank'}
                    href={
                        'https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.ruv.is%2Ffrett%2F2020%2F05%2F08%2Fkeppast-um-ad-bjarga-islenskunni-fra-glotun%3Ffbclid%3DIwAR2eCaDLsLZHP3W-GZ63nkm5IeJiX22vGRaooAgZwLI-1EDnNbQbkNmnfRs&h=AT0UIE5fNfFVFcVpl1f5dNP1QEV7N_r8NbWAVj7BhW0Bp01hq2TpDJcEeb1oZEI-HUZUa77n6v0GuSA1PidElU36BWpoWywhLXicUAc82SpnMl2OB3XKtytWWosNUotwjbY&__tn__=%2CmH-R&c[0]=AT3WxiNhyiAp5z23fi_vS8OjTgyiqx_YeKCfohGkX8A5yvZsNw310v1ry0U5UH772rEJcm2MLZ4it-V-OC6CGeVkmX9cWwrgTiQ7osEJovmTuWTuVpatU-rCD5oRE5ohCL0g77AugPkk3ziUlp8Qv0_ZKP1zpdbCs5kAQG8kmQkG6VtzoCc4UbXfIC6KR4SK3rUaO4Zhq5C8_JJ8RE3m'
                    }
                >
                    hér
                </StyledLink>{' '}
                fréttaskot frá keppninni í fyrra sem var æsispennandi.
            </Paragraph>
        </AboutContainer>
    );
};

export default AboutCompetition;
