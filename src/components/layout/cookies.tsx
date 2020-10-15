import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import CloseIcon from '../ui/icons/close';

interface ContainerProps {
    visible: boolean;
}

const CookiesModalContainer = styled.div<ContainerProps>`
    height: ${({ theme }) => theme.layout.cookieModalHeight};
    width: 100%;
    max-width: 100vw;
    background-color: black;
    color: white;
    display: flex;
    gap: 1.5rem;
    padding: 2rem;
    align-items: center;
    font-size: 1.2rem;
    position: fixed;
    bottom: ${({ theme, visible }) => visible ? 0 : `-${theme.layout.cookieModalHeight}`};
    z-index: 0;
    transition: bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    ${({ theme }) => theme.media.small} {
        font-size: 1rem;
    }
`;

const NavLink = styled.a`
    cursor: pointer;
    border-bottom: 1px solid white;
`;

const CloseButton = styled.div`
    cursor: pointer;

    :active {
        transform: translateY(2px);
    }
`;

interface Props {
    active: boolean;
    close: () => void;
}

const CookiesModal: React.FunctionComponent<Props> = ({ active, close }) => {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        active ? setVisible(true) : setVisible(false);
    });

    return (
        <CookiesModalContainer visible={visible}>
            <span>Þessi vefur notar vafrakökur.</span>
            <Link href={'/vafrakokustefna'}>
                <NavLink>Sjá nánar.</NavLink>
            </Link>
            <CloseButton onClick={close}>
                <CloseIcon height={30} fill={'white'} hoverFill={'white'} />
            </CloseButton>
        </CookiesModalContainer>
    );
}

export default CookiesModal;