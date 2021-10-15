import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import LoadingIcon from '../../ui/icons/loading';

const spin = keyframes`
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
`;

const LoadingContainer = styled.h3`
    padding: 2rem;
    margin: auto;
    ${({ theme }) => theme.media.smallUp} {
        grid-column: span 2;
    }
    animation-name: ${spin};
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;

const Loader: React.FunctionComponent = () => {
    return (
        <LoadingContainer>
            <LoadingIcon large />
        </LoadingContainer>
    );
};

export default Loader;
