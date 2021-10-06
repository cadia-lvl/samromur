import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../server/i18n';

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
    const { t, i18n } = useTranslation('about');
    return (
        <WhyContainer>
            <WhyInformation>
                <WhyTitle>{t('why.title')}</WhyTitle>
                <WhyParagraph>{t('why.beginning')}</WhyParagraph>
                <WhyParagraph>{t('why.middle')}</WhyParagraph>
                <WhyParagraph>
                    {t('why.end')}
                    <StyledLink
                        target={'blank'}
                        href={
                            i18n.language == 'isl'
                                ? 'https://www.stjornarradid.is/lisalib/getfile.aspx?itemid=56f6368e-54f0-11e7-941a-005056bc530c'
                                : 'https://notendur.hi.is/eirikur/mlt-en.pdf'
                        }
                    >
                        {t('why.here')}
                    </StyledLink>
                    .
                </WhyParagraph>
            </WhyInformation>
            <WhyImage src={'./images/robot@3x.png'} alt="Robot-with-people" />
        </WhyContainer>
    );
};

export default Why;
