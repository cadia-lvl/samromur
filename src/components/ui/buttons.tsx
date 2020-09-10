import * as React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic'

import { Clickable } from './containers';
import Icon, { IconProps } from './icons/icon';
import CloseIcon from './icons/close';
import PlayIcon from './icons/play';
import PauseIcon from './icons/pause';
import MicIcon from './icons/mic';
import MenuIcon from './icons/menu';
import RetryIcon from './icons/retry';
import RecycleBinIcon from './icons/recycle-bin';
import EditIcon from './icons/edit';

interface ButtonProps {
    onClickHandler: () => void;
    disabled?: boolean;
    icon?: IconProps;
}

interface MicButtonProps {
    recording: boolean;
}

const defaultColors = {
    fill: '#9DA7B0',
    outline: '#5F717F'
};

export const IconButton: React.FC<ButtonProps & IconProps> = props => {

    const IconComponent: React.ComponentType<IconProps> = dynamic(() => import(`./icons/${props.type}`));
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <IconComponent {...props.icon} />
        </Clickable>
    );
}

export const MicButton: React.FC<MicButtonProps & ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            {props.recording ?
                <PauseIcon {...props.icon} {...defaultColors} /> :
                <MicIcon {...props.icon} {...defaultColors} />
            }
        </Clickable>
    );
}

export const CloseButton: React.FC<ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <CloseIcon {...props.icon} />
        </Clickable>
    );
}

export const RetryButton: React.FC<ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <RetryIcon {...props.icon} {...defaultColors} />
        </Clickable>
    );
}

export const MenuButton: React.FC<ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <MenuIcon {...props.icon} />
        </Clickable>
    );
}

export const EditButton: React.FC<ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <EditIcon {...props.icon} />
        </Clickable>
    );
}

export const DeleteButton: React.FC<ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <RecycleBinIcon {...props.icon} />
        </Clickable>
    );
}

export const PauseButton: React.FC<ButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <PauseIcon {...props.icon} {...defaultColors} />
        </Clickable>
    );
}

interface PlayButtonProps {
    isPlaying: boolean;
}

export const PlayButton: React.FC<ButtonProps & PlayButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            <PlayIcon {...props.icon} {...defaultColors} fill={props.isPlaying ? undefined : defaultColors.fill} />
        </Clickable>
    );
}

interface PlayPauseButtonProps {
    isPlaying: boolean;
}

export const PlayPauseButton: React.FC<ButtonProps & PlayPauseButtonProps> = (props) => {
    return (
        <Clickable disabled={props.disabled ? props.disabled : false} onClick={props.onClickHandler}>
            {props.isPlaying ? <PauseIcon {...props.icon} {...defaultColors} /> : <PlayIcon {...props.icon} {...defaultColors} />}
        </Clickable>
    );
}

interface DefaultButtonProps {
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    color?: string;
    transparent?: boolean;
}

export const Button = styled.button<DefaultButtonProps>`
            height: 2.5rem;
  min-width: ${
    ({ small, medium, large }) => small ? '5rem' : medium ? '7.5rem' : large ? '10rem' : '5rem'
    };
  cursor: pointer;
  align-items: center;
  text-align: center;
  color: ${({ color }) => color == 'grey' ? 'grey' : 'white'};
  font-weight: bold;
  font-size: 1rem;
  outline: none;

  &::-moz-focus-inner {
                    border: 0;
  }

  &:hover, &:focus {
                    outline: none;
  }

  &:active {
                    transform: translateY(1px);
  }

  &:disabled {
                    pointer - events: none;
    background: lightgray;
  }

  ${({ theme, color, transparent }) => !transparent ? `
    border: 0px solid ${theme.colors.borderGray};
    background: ${color ? theme.colors[color] : theme.colors.blue};
    
  ` : `
    background: none;
    color: black;
    border: none;
    &:hover, &:focus {
        background: white;
    }
  `}

  
`;