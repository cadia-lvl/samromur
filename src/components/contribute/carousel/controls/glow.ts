import styled from 'styled-components';
import { WheelColor } from '../../../../types/contribute';
import { getWheelColorHEXShades } from '../../../../utilities/color-utility';

export interface GlowProps {
    color: WheelColor;
}

export const Glow = styled.div<GlowProps>`
    position: absolute;
    width: 6.2rem;
    height: 6.2rem;
    opacity: 0.5;
    background: linear-gradient(
        to left,
        ${({ color }) => getWheelColorHEXShades(color)}
    );
    border-radius: 50%;
    filter: blur(7.6px);
    transition: opacity 0.2s linear;

    & :hover {
        opacity: 1;
    }
`;
