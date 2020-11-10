import * as React from 'react';
import Icon, { IconProps } from './icon';

export const VolumeMute: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 65.509 65.509" className="close" {...props}>
        <g>
            <path
                d="M56.027,61.285c0,1.638-0.947,3.128-2.429,3.823c-0.573,0.27-1.187,0.401-1.798,0.401c-0.965,0-1.922-0.332-2.695-0.972
                l-23.098-19.14H13.706c-2.333,0-4.225-1.894-4.225-4.227V24.338c0-2.334,1.892-4.226,4.225-4.226h12.303l23.098-19.14
                c1.262-1.046,3.012-1.269,4.493-0.569c1.48,0.695,2.429,2.185,2.429,3.823L56.027,61.285L56.027,61.285z"
            />
        </g>
    </Icon>
);

export default VolumeMute;
