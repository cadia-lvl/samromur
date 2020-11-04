import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const DatasetHeaderContainer = styled.div`
    position: relative;
    margin: 0 auto;
    overflow: visible;
`;

const kf1 = keyframes`
    from {
        transform: translateX(-100%) scaleY(0);
    }
    to {
        transform: none;
    }
`;

const kf2 = keyframes`
    from {
        transform: translateX(-100%) scaleY(0);
    }
    5% {
        transform: translateX(-100%) scaleY(0);
    }
    to {
        transform: none;
    }
`;

const kf3 = keyframes`
    from {
        transform: translateX(-100%) scaleY(0);
    }
    40% {
        transform: translateX(-100%) scaleY(0);
    }
    to {
        transform: none;
    }
`;

interface WaveImageProps {
    i: number;
    fading?: boolean;
}

const WaveImage = styled.img<WaveImageProps>`
    position: ${({ i }) => (i == 2 ? 'relative' : 'absolute')};
    top: 0;
    bottom: 0;
    left: 0;
    right: ${({ i }) => (i == 3 ? '-5%' : 0)};
    margin: auto;
    animation: ${({ i }) => (i == 1 ? kf1 : i == 2 ? kf2 : kf3)} 3.5s
        cubic-bezier(0.23, 1, 0.32, 1);
    max-width: 100%;
`;

interface Props {}

export const DatasetHeader: React.FunctionComponent<Props> = (props) => {
    return (
        <DatasetHeaderContainer>
            <WaveImage src={'/images/eq-header-1.svg'} i={1} />
            <WaveImage src={'/images/eq-header-2.svg'} i={1} />
            <WaveImage src={'/images/eq-header-3.svg'} i={2} />
            <WaveImage src={'/images/eq-fading.svg'} i={1} fading />
            <WaveImage src={'/images/eq.svg'} i={3} />
        </DatasetHeaderContainer>
    );
};

export default DatasetHeader;
