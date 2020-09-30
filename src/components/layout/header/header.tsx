import * as React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";
import styled from 'styled-components';

import Navigation from './navigation';
import MenuIcon from '../../ui/icons/menu';
import { UserClient } from '../../../types/user';

const HeaderContainer = styled.div`
    position: fixed;
    background-color: white;
    z-index: ${({ theme }) => theme.z.top};
    top: 0;
    left: 0;
    right: 0;
    height: ${({ theme }) => theme.layout.headerHeight};
    box-shadow: 0 0 15px rgba(0,0,0,.08);
    -webkit-box-shadow: 0 0 10px rgba(0,0,0,.14);
    ${({ theme }) => theme.media.small} {
        box-shadow: 0 0 15px rgba(0,0,0,.08);
        -webkit-box-shadow: 0 0 10px rgba(0,0,0,.14);
    }

    ${({ theme }) => theme.media.smallUp} {
        position: relative;
        top: initial;
        bottom: initial;
        left: initial;
        right: initial;
    }
`;

const Header = styled.header`
    display: flex;
    padding: 1rem 0;
    justify-content: space-between;
    align-items: baseline;
    ${({ theme }) => theme.media.smallUp} {
        max-width: ${({ theme }) => theme.layout.headerWidth};
        margin: 0 auto;
    }
`;

const Heading = styled.h1`
    margin: 0 1rem;
    font-family: ${props => props.theme.fonts.title};
    font-weight: 900;
    font-size: 1.8rem;
`;

const HamburgerMenuButton = styled.div`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    cursor: pointer;
    display: none;
    ${({ theme }) => theme.media.small} {
        display: initial;
    }
`;

interface HeaderProps {
    toggleMenu: () => void;
    user: UserClient;
}

interface State {
    menuVisible: boolean;
}

type Props = HeaderProps & WithRouterProps;

class HeaderComponent extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);

        this.state = {
            menuVisible: false,
        }
    }

    toggleMenu = () => {
        this.setState({ menuVisible: !this.state.menuVisible });
    }

    render() {
        const { router, toggleMenu, user } = this.props;
        return (
            <HeaderContainer>
                <Header>
                    <Heading>
                        <Link href="/"><a>Samrómur</a></Link>
                    </Heading>
                    <Navigation user={user} />
                    <HamburgerMenuButton onClick={toggleMenu}>
                        <MenuIcon height={24} width={24} />
                    </HamburgerMenuButton>
                </Header>
            </HeaderContainer>
        );
    }
}

export default withRouter(HeaderComponent);