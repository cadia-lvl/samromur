import * as React from 'react';
import styled from 'styled-components';

import HeadsUpDisplay from './header/hud';
import Header from './header/header';
import Footer from './footer/footer';
import Navigation from './header/navigation';
import NotificationPill from '../ui/notifications/pill';
import { RootState } from 'typesafe-actions';
import { connect } from 'react-redux';

import { setCookieConsent } from '../../store/user/actions';
import CookiesModal from './cookies';

interface LayoutContainerProps {
    game?: boolean;
}

/* z-index: 10; */
const LayoutContainer = styled.div<LayoutContainerProps>`
    position: relative;
    width: 100vw;
    max-width: 100%;
    overflow-x: hidden;

    ${({ game, theme }) =>
        !game
            ? `
        height: 100vh;
        ${theme.media.small} {
            overflow-y: visible;
        }

        ${theme.media.smallUp} {
            overflow-y: auto;
        }
    `
            : `
        min-height: 100vh;
        overflow-y: auto;
        // background-color: linear-gradient(#492cdb, #b0ffff)
        
        display: flex;
        flex-direction: column;
        align-items: center;
    `};
`;

interface BackgroundProps {
    white?: boolean;
}

const Background = styled.div<BackgroundProps>`
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(153.29deg, #492cdb 13.49%, #b0ffff 91.26%);

    ${({ white }) => (white ? 'background: white;' : '')}
`;

const ContentAndFooter = styled.div`
    z-index: ${({ theme }) => theme.z.bottom};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow-x: hidden;

    /* position: absolute; */

    ${({ theme }) => theme.media.small} {
        position: absolute;
        top: 0; //${({ theme }) => theme.layout.headerHeight};
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;
        height: inherit;
        /* 
        & > :nth-child(1) {
            min-height: 100%;
            min-height: ${({ theme }) =>
            `calc(100% - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`};
        } */
    }

    ${({ theme }) => theme.media.smallUp} {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        /* & > :nth-child(1) {
            min-height: ${({ theme }) =>
            `calc(100vh - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`};
        } */
    }
`;
/* `calc(100vh - ${theme.layout.headerHeight})`}; */
/* `calc(100vh - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`}; */

const FloatingNavigation = styled(Navigation)`
    ${({ theme }) => theme.media.smallUp} {
        display: none;
    } ;
`;

interface GameContentProps {
    gaming: boolean;
}

const GameContent = styled.div<GameContentProps>`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: ${({ gaming }) => (!gaming ? '3rem' : '0rem')};
`;

const Notifications = styled.div`
    position: absolute;
    z-index: ${({ theme }) => theme.z.override};
    top: 15%;
    width: 100%;
    display: flex;
    justify-content: center;
`;

interface LayoutProps {
    children?: React.ReactNode;
    game?: boolean;
    white?: boolean;
}

interface State {
    menuVisible: boolean;
}

const dispatchProps = {
    setCookieConsent,
};

type Props = ReturnType<typeof mapStateToProps> &
    LayoutProps &
    typeof dispatchProps;

class Layout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            menuVisible: false,
        };
    }

    toggleMenu = () => {
        this.setState({ menuVisible: !this.state.menuVisible });
    };

    handleCloseCookies = () => {
        this.props.setCookieConsent(true);
    };

    render() {
        const {
            contribute: { expanded, gaming, goal },
            game,
            children,
            notifications,
            user: {
                client,
                consents: { cookies },
            },
            white,
        } = this.props;
        const { menuVisible } = this.state;

        return (
            <LayoutContainer game={game}>
                {notifications.length > 0 && (
                    <Notifications>
                        <NotificationPill notification={notifications[0]} />
                    </Notifications>
                )}
                {!game ? (
                    <Background white={white ? white : false}>
                        <Header
                            user={client}
                            toggleMenu={this.toggleMenu}
                            light={white ? white : false}
                        />
                        <FloatingNavigation
                            user={client}
                            floating
                            visible={menuVisible}
                        />
                        <ContentAndFooter>
                            {children}
                            <Footer />
                        </ContentAndFooter>
                    </Background>
                ) : (
                    <React.Fragment>
                        <HeadsUpDisplay />
                        <GameContent gaming={gaming}>{children}</GameContent>
                        {!gaming && <Footer />}
                    </React.Fragment>
                )}
                <CookiesModal
                    active={!cookies}
                    close={this.handleCloseCookies}
                />
            </LayoutContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    notifications: state.ui.notifications,
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(Layout);
