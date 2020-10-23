import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 2rem;
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 2rem;
    border-radius: 1rem;
    border: 1px solid lightGray;
    overflow: hidden;
`;

interface FillerProps {
    ratio: number;
}
const Filler = styled.div.attrs(
    ({ ratio }: FillerProps) => ({
        style: {
            maxWidth: `calc(${ratio} * 100%)`,
        }
    })) <FillerProps>`
    height: 100%;
    background-color: #60C197;
    width: 100%;
    transition: max-width ${({ ratio }) => ratio === 0 ? '0.3s' : '1s'} linear;
`;

const Splitter = styled.div<{ pos: number }>`
    position: absolute;
    left: ${({ pos }) => pos}%;
    top: 0;
    width: 2px;
    background-color: lightGray;
    height: 3rem;
`;

const Indicator = styled.div<{ pos: number }>`
    position: absolute;
    left: ${({ pos }) => pos}%;
    top: 3.5rem;
    margin-left: -2.3rem;
    font-weight: 600;
`;

interface Props {
    max: number;
    val: number;
}

export const ProgressBar: React.FunctionComponent<Props> = ({ max, val }) => {

    return (
        <Wrapper>
            <ProgressBarContainer>
                <Filler ratio={val / max} />
            </ProgressBarContainer>
        </Wrapper>

    );
}

export default ProgressBar;