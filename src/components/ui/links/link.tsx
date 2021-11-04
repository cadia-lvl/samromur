import styled from 'styled-components';

export const StyledLink = styled.a`
    color: ${({ theme }) => theme.colors.blue};
    :visited,
    :focus {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blue};
    }

    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blackOlive};
    }
`;
