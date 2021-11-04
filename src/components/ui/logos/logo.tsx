import styled from 'styled-components';

const Logo = styled.svg.attrs({
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
})``;

export interface LogoProps {
    size?: string;
    fill?: string;
}

export default styled(Logo)<LogoProps>`
    width: ${({ size }) => (size ? size : '100%')};
`;
