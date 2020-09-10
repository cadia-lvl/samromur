import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { withRouter } from 'next/router'
import { WithRouterProps } from "next/dist/client/with-router";

import { useTranslation, nextI18next } from '../../../server/i18n';
import { logout } from '../../../services/auth-api';


import { UserClient } from '../../../types/user';
import { Button } from '../../ui/buttons';
interface NavLinkProps {
    isActive?: boolean;
}

const NavLink = styled.a<NavLinkProps>`
    margin-right: 3rem;
    cursor: pointer;
    color: ${ ({ theme, isActive }) => isActive && theme.colors.red} !important;
    & : hover {
        color: ${ ({ theme, isActive }) => isActive && theme.colors.red} !important;
    }
`;

// Different styles for the floating navigation
const NavigationContainer = styled.div<Props>`
    display: flex;
    ${({ theme, floating, visible, admin }) => floating ? `
        position: fixed;
        top: ${theme.layout.headerHeight};
        z-index: ${theme.z.middle};
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform: ${visible ? 'translateY(0)' : 'translateY(-100vh)'};
        ` : `
        flex: 1;
        justify-content: space-between;
        align-items: center;
        text-transform: uppercase;
        ${theme.media.small} {
            display: none;
        }
        `
    }
`;

const NavigationLinks = styled.div<Props>`
    display: flex;
    flex-direction: ${({ floating }) => floating ? 'column' : 'row'};
    ${({ floating, theme, admin }) => floating ? `
        height: 100vh;
        width: 100vw;
        background-color: white;
        * {
            margin: 1rem 3rem;
            font-size: 1.5rem;
            border-bottom: 1px solid ${theme.colors.borderGray};
        }
    ` : `
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0 2rem 0 5rem;
        align-items: center;
        text-transform: uppercase;

        ${theme.media.mediumDown} {
            padding: 0 1rem 0 2rem;
        }
    `}
`;

const LoginContainer = styled.div`
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0 1rem;
    align-items: center;
    text-transform: uppercase;

    & > * {
        margin-right: 0;
    }
`;

interface NavigationProps {
    admin?: boolean;
    className?: string;
    floating?: boolean;
    visible?: boolean;
    user: UserClient;
}

type Props = NavigationProps & WithRouterProps;

export const Navigation: React.FunctionComponent<Props> = (props) => {
    const { admin, floating, router, user } = props;
    const { pathname } = router;
    const adminPaths = pathname.split('/').splice(1);
    const { t } = useTranslation(['links'], { i18n: nextI18next.i18n });

    return (
        <NavigationContainer {...props}>
            {
                (admin && !floating) ? (
                    <NavigationLinks {...props}>
                        {
                            adminPaths.map((path: string, index: number) => {
                                const appendix = index > 0 ? adminPaths.splice(0, index + 1).reduce(
                                    (prev: string, curr: string) => {
                                        const prepended = '/' + curr;
                                        return prev += prepended;
                                    }
                                ) : path;
                                const href = '/' + appendix
                                return (
                                    <Link href={href} key={index}>
                                        <NavLink isActive={pathname == href}>{t(path)}</NavLink>
                                    </Link>
                                );
                            })
                        }
                    </NavigationLinks>
                ) : (
                        <NavigationLinks {...props}>
                            <Link href='/'>
                                <NavLink isActive={pathname == '/'}>Forsíða</NavLink>
                            </Link>
                            <Link href='/takathatt'>
                                <NavLink isActive={pathname == '/takathatt'}>Taka þátt</NavLink>
                            </Link>
                            <Link href='/gagnasafn'>
                                <NavLink isActive={pathname == '/gagnasafn'}>Gagnasafnið</NavLink>
                            </Link>
                            <Link href='/um'>
                                <NavLink isActive={pathname == '/um'}>Um Samróm</NavLink>
                            </Link>
                            {
                                floating && (
                                    <Link href='/innskraning'>
                                        <NavLink isActive={pathname == '/innskraning'}>Innskráning</NavLink>
                                    </Link>
                                )
                            }
                        </NavigationLinks>
                    )
            }
            <LoginContainer>
                {
                    !user.isAuthenticated ? (
                        <NavLink href={'/innskraning'} isActive={pathname == '/innskraning'}>Innskráning</NavLink>
                    ) : (
                            <React.Fragment>
                                <NavLink href={'/minar-sidur'} isActive={pathname == '/minar-sidur'}>Mínar síður</NavLink>
                                <Button transparent color="red" onClick={logout}>Útskrá</Button>
                            </React.Fragment>

                        )
                }

            </LoginContainer>
        </NavigationContainer>
    );
}


export default withRouter(Navigation);