import * as React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';

ReactModal.setAppElement('body');

interface ModalProps extends ReactModal.Props {
    className?: string;
}

const ReactModalAdapter: React.SFC<ModalProps> = ({
    className,
    ...props
}: ModalProps) => {
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

// TODO: add a background color from theme
export const Modal = styled(ReactModalAdapter)`
    &__Overlay {
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: ${({ theme }) => theme.z.override};
        width: 100%;
        height: 100%;
        transition: opacity 0.25s ease-in-out;
        display: table;
        overflow-y: auto;

        &.ReactModal__Overlay--after-open {
            opacity: 1;
        }

        &.ReactModal__Overlay--before-close {
            opacity: 0;
        }

        ${({ theme }) => theme.media.extraSmallDown} {
            display: block;
        }
    }

    &__Content {
        position: static !important;
        display: table-cell;
        vertical-align: middle;
        pointer-events: none;
        border: none !important;
        width: 100%;

        ${({ theme }) => theme.media.extraSmallDown} {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            border-radius: 0 !important;
            display: inline-block;
        }

        & .inner {
            position: relative;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 2rem;
            max-width: 40rem;
            min-height: auto;
            width: 100%;
            text-align: center;
            background: white;
            pointer-events: all;
            box-shadow: 0 2px 44px 0 color-mod(#0043a0 alpha(50%));

            ${({ theme }) => theme.media.extraSmallDown} {
                min-height: 99vh;
            }
        }
    }
`;

export default Modal;
