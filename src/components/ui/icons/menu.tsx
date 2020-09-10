import * as React from 'react';
import Icon, { IconProps } from './icon';

export const Menu: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 150 150" className="close" {...props} >
        <g id="XMLID_240_">
            <path id="XMLID_241_" d="M15,30h120c8.284,0,15-6.716,15-15s-6.716-15-15-15H15C6.716,0,0,6.716,0,15S6.716,30,15,30z" />
            <path id="XMLID_242_" d="M135,60H15C6.716,60,0,66.716,0,75s6.716,15,15,15h120c8.284,0,15-6.716,15-15S143.284,60,135,60z" />
            <path id="XMLID_243_" d="M135,120H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h120c8.284,0,15-6.716,15-15S143.284,120,135,120z" />
        </g>
    </Icon >
);

export default Menu;