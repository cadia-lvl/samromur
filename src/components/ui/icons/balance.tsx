import * as React from 'react';
import Icon, { IconProps } from './icon';

/* Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> 
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */
export const Balance: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 509.259 509.259" className="balance" {...props}>
        <path d="m314.88 410.38h-120.5c-41.493 0-75.25 33.757-75.25 75.25 0 8.284 6.716 15 15 15h241c8.284 0 15-6.716 15-15 0-41.493-33.757-75.25-75.25-75.25z" />
        <path d="m164.974 246.719h-164.974c7.094 39.102 41.37 68.857 82.487 68.857s75.393-29.755 82.487-68.857z" />
        <path d="m344.286 246.719c7.094 39.102 41.37 68.857 82.487 68.857s75.392-29.755 82.487-68.857z" />
        <path
            d="m82.487 127.546 44.587 89.173h33.541l-53.857-107.714h122.747v271.375h50.25v-271.375h122.747l-53.857 
        107.714h33.541l44.587-89.173 44.586 89.173h33.541l-64.711-129.423c-2.541-5.082-7.735-8.292-13.416-8.292h-147.018v-45.25c0-13.854-11.271-25.125-25.125-25.125s-25.125 
        11.271-25.125 25.125v45.25h-147.018c-5.682 0-10.876 3.21-13.416 8.292l-64.712 129.423h33.541z"
        />
    </Icon>
);

export default Balance;
