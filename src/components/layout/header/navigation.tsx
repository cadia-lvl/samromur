import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { useTranslation, nextI18next } from '../../../server/i18n';

import * as authApi from '../../../services/auth-api';
import { UserClient } from '../../../types/user';
import * as colors from '../../competition/ui/colors';
import { isCompetitionOver } from '../../../utilities/competition-helper';

const colorDark = '#6498FF';

interface NavLinkProps {
    isActive?: boolean;
    light?: boolean;
}

const NavLink = styled.a<NavLinkProps>`
    cursor: pointer;
    color: ${({ light }) => (light ? colorDark : 'white')} !important;
    margin: 0 1rem;
    &:hover {
        color: ${colors.siminn} !important;
    }
`;

NavLink.defaultProps = {
    light: false,
};

const NavButton = styled.span`
    cursor: pointer;
`;

// Different styles for the floating navigation
const NavigationContainer = styled.div<Props>`
    display: flex;
    ${({ theme, floating, visible }) =>
        floating
            ? `
        position: fixed;
        top: 5rem;
        right: 0;
        z-index: ${theme.z.middle};
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform: ${visible ? 'translateY(0)' : 'translateY(-100vh)'};
        `
            : `
        flex: 1;
        justify-content: flex-end;
        align-items: right;

        ${theme.media.small} {
            display: none;
        }
        `}
`;

const NavigationLinks = styled.div<Props>`
    width: 100%;
    display: flex;
    flex-direction: ${({ floating }) => (floating ? 'column' : 'row')};
    ${({ floating, theme }) =>
        floating
            ? `
            background-color: white;
        * {
            display: flex;
            justify-content: flex-end;
            margin: 1rem 3rem;
            font-size: 1.5rem;
            border-bottom: 1px solid ${theme.colors.borderGray};
        }
    `
            : `
        justify-content: flex-end;
        font-size: 1rem;
        padding: 0 2rem;
        align-items: center;
    `}
`;

interface NavigationProps {
    className?: string;
    floating?: boolean;
    visible?: boolean;
    user: UserClient;
    light?: boolean;
}

type Props = NavigationProps & WithRouterProps;

export const Navigation: React.FunctionComponent<Props> = (props) => {
    const {
        floating,
        router,
        user,
        user: { username },
        light,
    } = props;
    const { pathname } = router;
    const { t } = useTranslation(['links', 'common']);

    return (
        <NavigationContainer {...props}>
            <NavigationLinks {...props}>
                {/* <Link href="/" passHref>
                    <NavLink isActive={pathname == '/'}>
                        {t('common:homepage')}
                    </NavLink>
                </Link> */}
                {/* <Link href="/tala" passHref>
                    <NavLink isActive={pathname == '/tala'}>
                        {t('common:take-part')}
                    </NavLink>
                </Link> */}
                {!isCompetitionOver() && (
                    <Link href="/skra" passHref>
                        <NavLink isActive={pathname == '/skra'} light={light}>
                            Skrá
                        </NavLink>
                    </Link>
                )}
                <Link href="/keppni" passHref>
                    <NavLink isActive={pathname == '/keppni'} light={light}>
                        Stigatafla
                    </NavLink>
                </Link>
                {/* <Link href="/grunnskolakeppni" passHref>
                    <NavLink isActive={pathname == '/grunnskolakeppni'}>
                        {t('grunnskola-keppni')}
                    </NavLink>
                </Link>
                <Link href="/gagnasafn" passHref>
                    <NavLink isActive={pathname == '/gagnasafn'}>
                        {t('the-database')}
                    </NavLink>
                </Link> */}
                {/* <Link href="/um" passHref>
                    <NavLink isActive={pathname == '/um'}>
                        Samstarfsaðilar
                    </NavLink>
                </Link> */}
                {/* <NavLink
                    href="/minar-sidur"
                    isActive={pathname == '/minar-sidur'}
                >
                    {username ? `Hæ ${username}!` : t('my-pages')}
                </NavLink> */}
                {/* {user.isAuthenticated && (
                    <NavButton onClick={authApi.logout}>Útskrá</NavButton>
                )} */}
            </NavigationLinks>
        </NavigationContainer>
    );
};

export default withRouter(Navigation);
