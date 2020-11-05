import * as React from 'react';
import styled from 'styled-components';
import { CloseButton } from './buttons';

interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    onClose?: () => void;
    ref?: React.RefObject<HTMLDivElement>;
    title?: string;
}

const Floating = styled.div<ContainerProps>`
    position: relative;
    padding: 0 1rem 1rem 0;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.borderGray};
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
`;

const CloseButtonContainer = styled.div<{ visible?: boolean }>`
    visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
    position: absolute;
    right: 1rem;
    top: 1rem;
`;

const Title = styled.h3`
    padding: 1rem 0 1rem 1rem;
`;

export const FloatingContainer = React.forwardRef(
    (props: ContainerProps, ref: React.Ref<HTMLDivElement>) => {
        return (
            <Floating {...props}>
                <CloseButtonContainer visible={!!props.onClose}>
                    <CloseButton
                        icon={{ height: 15, width: 15 }}
                        onClickHandler={
                            !!props.onClose ? props.onClose : () => {}
                        }
                    />
                </CloseButtonContainer>
                <Title>{props.title}</Title>
                {props.children}
            </Floating>
        );
    }
);

export const NoSelectDiv = styled.div`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

export interface ClickableProps {
    disabled: boolean;
}

export const Clickable = styled.div<ClickableProps>`
    ${({ disabled }) =>
        disabled
            ? `
        opacity: 0.4;
        filter: alpha(opacity=40);
        zoom: 1;
    `
            : `
        cursor: pointer;
        & :active {
            transform: translateY(1px);
        }
    `}
`;
