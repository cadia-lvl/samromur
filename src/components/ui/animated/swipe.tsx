import * as React from 'react';
import styled from 'styled-components';

interface SwapProps {
    second: boolean;
    height: number;
    width: number;
}

const SwapContainer = styled.div<SwapProps>`
    position: relative;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    & > * {
        position: absolute;
        transition:
            transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            scale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    > *:nth-child(1) {
        transform:
            ${({ second }) => `translateX(${second ? '-25%' : '0%'})`}
            scale(${({ second }) => second ? 0 : 1});
    }

    > *:nth-child(2) {
        transform:
            ${({ second }) => `translateX(${!second ? '25%' : '0%'})`}
            scale(${({ second }) => !second ? 0 : 1});
    }
`;

const FakeContainer = styled.div`
    position: absolute;
    opacity: 0;
    pointer-events: none;
`;

interface Props {
    children?: React.ReactNode;
    className?: string;
    second: boolean;
    ref?: React.Ref<HTMLDivElement>;
}

interface State {
    height: number;
    width: number;
}

class SwipeSwap extends React.Component<Props, State> {
    private firstFakeRef = React.createRef<HTMLDivElement>();
    private secondFakeRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            height: 0,
            width: 0,
        }
    }

    componentDidMount = () => {
        const firstWidth = this.firstFakeRef.current?.clientWidth;
        const secondWidth = this.secondFakeRef.current?.clientWidth;
        if (!!firstWidth && !!secondWidth) {
            this.setState({ width: Math.max(firstWidth, secondWidth) + 1 });
        }
        const firstHeight = this.firstFakeRef.current?.clientHeight;
        const secondHeight = this.secondFakeRef.current?.clientHeight;
        if (!!firstHeight && !!secondHeight) {
            this.setState({ height: Math.max(firstHeight, secondHeight) + 1 });
        }
    }

    render() {
        const { children, className, second, ref } = this.props;
        const { width, height } = this.state;
        const firstChild = Array.isArray(children) ? children[0] : undefined;
        const secondChild = Array.isArray(children) ? children[1] : undefined
        return (
            <React.Fragment>
                <SwapContainer className={className} ref={ref} second={second} width={width} height={height}>
                    {children}
                </SwapContainer>
                <FakeContainer ref={this.firstFakeRef}>
                    {firstChild}
                </FakeContainer>
                <FakeContainer ref={this.secondFakeRef}>
                    {secondChild}
                </FakeContainer>
            </React.Fragment>
        );
    }
};


export default React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => <SwipeSwap {...props} ref={ref as any} />);