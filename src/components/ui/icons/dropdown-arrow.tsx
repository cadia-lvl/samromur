import * as React from 'react';
import Icon, { IconProps } from './icon';

export const DropdownArrow: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 13 9" className="dropdown-arrow" {...props}>
        <polygon
            id="down-arrow-black"
            points="11.7578125 0.75 12.5 1.5703125 6.25 8.25 0 1.5703125 0.7421875 0.75 6.25 6.609375"
        ></polygon>
    </Icon>
);

export default DropdownArrow;
