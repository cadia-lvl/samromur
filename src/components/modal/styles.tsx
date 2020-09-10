import * as React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';

ReactModal.setAppElement('body')

interface ModalProps extends ReactModal.Props {
    className?: string;
}

const ReactModalAdapter: React.SFC<ModalProps> = ({ className, ...props }: ModalProps) => {
    const contentClassName = `${className}__Content`;
    const overlayClassName = `${className}__Overlay`;
    return (
        <ReactModal
            closeTimeoutMS={250}
            portalClassName={className}
            className={contentClassName}
            overlayClassName={overlayClassName}
            {...props}
        />
    );
};

export const Modal = styled(ReactModalAdapter)`
    &__Overlay {
        z-index: ${({ theme }) => theme.z.override};
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity 0.25s ease-in-out;
        overflow: auto;
        opacity: 0;
        &.ReactModal__Overlay--after-open {
            opacity: 1;
        }
        
        &.ReactModal__Overlay--before-close {
            opacity: 0;
        }
    }

    &__Content {
        display: table-cell;
        vertical-align: middle;
        pointer-events: none;
        border: none !important;
    }

    & .close {
        background-color: white;
        outline: none;
        cursor: pointer;
        position: absolute;
        right: 8px;
        top: 8px;
        border: none;
        &:active {
            margin-top: 2px;
        }
    }

    & .inner {
        position: fixed;
        top: 40%;
        left: 50%;
        border-radius: 0.2rem;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        padding: 2rem;
        min-width: 20rem;
        max-width: 100%;
        max-height: 100%;
        background: white;
        pointer-events: all;
        box-shadow: 0 2px 44px 0 color-mod(#0043a0 alpha(50%));
    }
`

export default Modal;