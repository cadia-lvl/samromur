import styled from 'styled-components'

const Icon = styled.svg.attrs({
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
})``

export interface IconProps {
    height?: number;
    width?: number;
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    fill?: string;
    hoverFill?: string;
    outline?: string;
    type?: string;
}

// To-do: large to medium and medium to small etc on small screens
export default styled(Icon) <IconProps>`

    height: ${({ height, small, medium, large, theme }) => {
        const sizes = theme.ui.icons.sizes;
        if (!!height) {
            return `${height}px`;
        }
        return small ? sizes.small : medium ? sizes.medium : large ? sizes.large : sizes.medium
    }};

    width: ${({ width, small, medium, large, theme }) => {
        const sizes = theme.ui.icons.sizes;
        if (!!width) {
            return `${width}px`;
        }
        return small ? sizes.small : medium ? sizes.medium : large ? sizes.large : sizes.medium
    }};

    ${({ theme }) => theme.media.small} {
        overflow-y: visible;
    }

    fill: ${({ fill, theme }) => !!fill ? theme.colors[fill] : theme.colors.richBlack};
    ${({ hoverFill, theme }) => !!hoverFill && `
        & :hover {
            fill: ${theme.colors[hoverFill]};
        }
    `}
`;