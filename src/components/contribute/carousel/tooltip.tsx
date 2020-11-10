import * as React from 'react';
import styled from 'styled-components';

interface Props {}

const TooltipContainer = styled.div`
    position: absolute;
    left: -11rem;
`;

const Tooltip = styled.div`
    position: relative;
    display: flex;
    background-color: white;
    border: 0.1rem solid #2f4f4f;
    width: 10rem;
    height: 2rem;
    justify-content: center;
    align-items: center;

    & :before,
    :after {
        content: '';
        position: absolute;
        left: 100%;
        width: 0;
        height: 0;
    }

    & :before {
        border-top: 0.6rem solid transparent;
        border-bottom: 0.6rem solid transparent;
        border-left: 0.6rem solid #2f4f4f;
    }

    & :after {
        border-top: 0.45rem solid transparent;
        border-bottom: 0.45rem solid transparent;
        border-left: 0.45rem solid white;
    }
`;

const CloseTooltip: React.FC<Props> = (props) => {
    return (
        <TooltipContainer>
            <Tooltip>Tooltip</Tooltip>
        </TooltipContainer>
    );
};

export default CloseTooltip;
