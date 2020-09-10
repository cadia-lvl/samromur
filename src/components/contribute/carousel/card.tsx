import * as React from 'react';
import styled from 'styled-components';

import ContinueModal from '../continue/continue';
import { WheelSentence } from '../../../types/sentences';

interface CardContainerProps {
    position: number;
    isRemoved: boolean;
    expanded: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
    ${({ position }) => Math.abs(position) > 4 && `display: none;`}
    position: absolute;
    box-sizing: border-box;
    background-color: white;
    top: ${({ expanded, position, theme }) => (position == 0 && expanded) ? '0rem' : theme.layout.hudHeight};
    bottom: ${({ theme, expanded, position }) => (position == 0 && expanded) ? '0rem' : `calc(60% - ${theme.layout.hudHeight})`};

    ${({ theme }) => theme.media.smallUp} {
        bottom: ${({ theme, expanded, position }) => (position == 0 && expanded) ? '0rem' : `calc(60% - ${theme.layout.hudHeight})`};
        height: ${({ expanded, position }) => (position == 0 && expanded) ? '100vh' : '40%'};
    }

    left: ${({ expanded, position }) => (position == 0 && expanded) ? '0rem' : '1rem'};
    right: ${({ expanded, position }) => (position == 0 && expanded) ? '0rem' : '1rem'};
    overflow: visible;
    word-wrap: break-word;

    //pointer-events: ${({ expanded, position }) => (position == 0 && !expanded) ? 'none' : 'initial'};
    cursor: ${({ position }) => position == 0 ? 'default' : 'pointer'};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    transform:
        ${({ position, isRemoved }) => isRemoved ? `translateY(-100%)` : `translateX(${position != 0 ? position > 0 ? 50 : -50 : 0}%)`}
        scale(${({ position, isRemoved }) => isRemoved ? 0 : (1 - (Math.abs(position) * 0.1))});
    
    transition:
        transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        top 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        left 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        right 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    z-index: ${({ position }) => 7 - Math.abs(position)};

    ${({ position }) => position == 0 && `
        box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
        -moz-box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
        -webkit-box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
    `}
    
`;

const Content = styled.div<{ position: number }>`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    opacity: 1;
    
    & > * {
        ${({ theme }) => theme.media.small} {
            ${({ position }) => position != 0 && `opacity: 0;`}
        }
        filter: blur(${({ position }) => position == 0 ? 0 : 5}px);
        transition:
            filter 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

interface OverlayProps {
    expanded: boolean;
    position: number;
}

const OverlayContent = styled.div<OverlayProps>`
    position: absolute;
    opacity: ${({ expanded, position }) => (expanded && position == 0) ? '100%' : '0%'};
    height: 100%;
    width: 100%;
    z-index: 8;
    transition:
        opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CardText = styled.p`
    font-family: ${({ theme }) => theme.fonts.transcript};
    font-size: 1.6rem;
    ${({ theme }) => theme.media.small} {
        font-size: 1.4rempx;
    }
    margin: 0;
    font-weight: 500;
    line-height: 1.38;
`;


interface CardProps {
    children?: React.ReactNode;
    expanded: boolean;
    sentence: WheelSentence;
    position: number;
    onClick: () => void;
    onContinue: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    expanded,
    sentence,
    position,
    onClick,
    onContinue,
}) => {

    return (
        <CardContainer
            onClick={onClick}
            expanded={expanded}
            isRemoved={!!sentence.removed}
            position={position}
        >
            <Content position={position}>
                <OverlayContent
                    expanded={expanded}
                    position={position}
                >
                    <ContinueModal
                        expanded={expanded}
                        onContinue={onContinue}
                    />
                </OverlayContent>
                <CardText>
                    {sentence.text}
                </CardText>
            </Content>
        </CardContainer>
    );
}

export default Card;