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
        background-color: ${theme.colors.blue};
        
        display: flex;
        flex-direction: column;
        align-items: center;
    `}
`;

const ContentAndFooter = styled.div`
    z-index: ${({ theme }) => theme.z.bottom};
    justify-content: space-between;
    overflow-x: hidden;

    ${({ theme }) => theme.media.small} {
        position: fixed;
        top: ${({ theme }) => theme.layout.headerHeight};
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;
        height: inherit;

        & > :nth-child(1) {
            min-height: ${({ theme }) =>
                `calc(100% - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`};
        }
    }

    ${({ theme }) => theme.media.smallUp} {
        position: relative;
        top: initial;
        left: initial;
        right: initial;
        bottom: initial;

        & > :nth-child(1) {
            min-height: ${({ theme }) =>
                `calc(100vh - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`};
        }
    }
`;

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
                    <React.Fragment>
                        <Header user={client} toggleMenu={this.toggleMenu} />
                        <FloatingNavigation
                            user={client}
                            floating
                            visible={menuVisible}
                        />
                        <ContentAndFooter>
                            {children}
                            <Footer />
                        </ContentAndFooter>
                    </React.Fragment>
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
