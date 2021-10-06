import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../server/i18n';

const PartnersContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    vertical-align: text-top;
    gap: 2rem;
    margin: 0 auto;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
    }
`;

const InfoContainer = styled.div`
    margin-top: 4rem;
    display: flex;
    flex-direction: column;

    & h1 {
        margin-bottom: 1.8rem;
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

const RobotImage = styled.img`
    ${({ theme }) => theme.media.small} {
        display: none;
    }
`;

interface Props {}

export const Partners: React.FunctionComponent<Props> = (props) => {
    const { t } = useTranslation('about');
    return (
        <PartnersContainer>
            <RobotImage src={'./images/robot-footer.svg'} alt="Robot" />
            <InfoContainer>
                <h1>{t('partners')}</h1>
                <span>
                    {t('backers-text')}
                    <StyledLink
                        target={'blank'}
                        href={'https://www.facebook.com/almannaromur/'}
                    >
                        Almannarómur
                    </StyledLink>
                    ,
                </span>
                <span>
                    <StyledLink
                        target={'blank'}
                        href={'https://www2.deloitte.com/is/is.html'}
                    >
                        Deloitte
                    </StyledLink>
                    ,{' '}
                    <StyledLink target={'blank'} href={'https://www.ru.is/'}>
                        {t('reykjavik-university')}
                    </StyledLink>
                    ,
                </span>
                <span>
                    {t('and')}
                    <StyledLink
                        target={'blank'}
                        href={
                            'https://www.rannis.is/sjodir/menntun/nyskopunarsjodur-namsmanna/'
                        }
                    >
                        Nýsköpunarsjóður námsmanna
                    </StyledLink>
                    .
                </span>
            </InfoContainer>
        </PartnersContainer>
    );
};

export default Partners;
