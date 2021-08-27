import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { useTranslation, nextI18next } from '../../../server/i18n';

import * as authApi from '../../../services/auth-api';
import { UserClient } from '../../../types/user';

interface NavLinkProps {
    isActive?: boolean;
}

const NavLink = styled.a<NavLinkProps>`
    cursor: pointer;
    color: ${({ theme, isActive }) => isActive && theme.colors.red} !important;
    &:hover {
        color: ${({ theme }) => theme.colors.darkerBlue} !important;
    }
`;

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
        top: ${theme.layout.headerHeight};
        z-index: ${theme.z.middle};
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform: ${visible ? 'translateY(0)' : 'translateY(-100vh)'};
        `
            : `
        flex: 1;
        justify-content: space-between;
        align-items: center;

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
        height: 100vh;
        width: 100vw;
        background-color: white;
        * {
            margin: 1rem 3rem;
            font-size: 1.5rem;
            border-bottom: 1px solid ${theme.colors.borderGray};
        }
    `
            : `
        justify-content: space-around;
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
}

type Props = NavigationProps & WithRouterProps;

export const Navigation: React.FunctionComponent<Props> = (props) => {
    const {
        floating,
        router,
        user,
        user: { username },
    } = props;
    const { pathname } = router;
    const { t } = useTranslation(['links'], { i18n: nextI18next.i18n });

    return (
        <NavigationContainer {...props}>
            <NavigationLinks {...props}>
                <Link href="/" passHref>
                    <NavLink isActive={pathname == '/'}>Forsíða</NavLink>
                </Link>
                <Link href="/takathatt" passHref>
                    <NavLink isActive={pathname == '/takathatt'}>
                        Taka þátt
                    </NavLink>
                </Link>
                <Link href="/grunnskolakeppni" passHref>
                    <NavLink isActive={pathname == '/grunnskolakeppni'}>
                        Grunnskólakeppni
                    </NavLink>
                </Link>
                <Link href="/gagnasafn" passHref>
                    <NavLink isActive={pathname == '/gagnasafn'}>
                        Gagnasafnið
                    </NavLink>
                </Link>
                <Link href="/um" passHref>
                    <NavLink isActive={pathname == '/um'}>Um Samróm</NavLink>
                </Link>
                <NavLink
                    href="/minar-sidur"
                    isActive={pathname == '/minar-sidur'}
                >
                    {username ? `Hæ ${username}!` : 'Mínar síður'}
                </NavLink>
                {user.isAuthenticated && (
                    <NavButton onClick={authApi.logout}>Útskrá</NavButton>
                )}
            </NavigationLinks>
        </NavigationContainer>
    );
};

export default withRouter(Navigation);
