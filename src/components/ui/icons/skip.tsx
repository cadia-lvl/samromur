import * as React from 'react';
import Icon, { IconProps } from './icon';

export const Skip: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 510 510" className="skip-icon" {...props}>
        <path
            d="M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M51,255c0-112.2,91.8-204,204-204
			c45.9,0,89.25,15.3,124.95,43.35l-285.6,285.6C66.3,344.25,51,300.9,51,255z M255,459c-45.9,0-89.25-15.3-124.95-43.35
			L415.65,130.05C443.7,165.75,459,209.1,459,255C459,367.2,367.2,459,255,459z"
        />
    </Icon>
);

export default Skip;
