import * as React from 'react';
import Icon, { IconProps } from './icon';

export const BackArrow: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 482.239 482.239" className="arrow-left" {...props}>
        <path d="m206.812 34.446-206.812 206.673 206.743 206.674 24.353-24.284-165.167-165.167h416.31v-34.445h-416.31l165.236-165.236z" />
    </Icon>
);

export default BackArrow;
