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
        top: 0;
        left: 0;
        right: 0;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    > *:nth-child(1) {
        opacity: ${({ second }) => (second ? 0 : 1)};
    }

    > *:nth-child(2) {
        opacity: ${({ second }) => (!second ? 0 : 1)};
    }
`;

const FakeContainer = styled.div`
    position: absolute;
    opacity: 0;
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

class OpacitySwap extends React.Component<Props, State> {
    private firstFakeRef = React.createRef<HTMLDivElement>();
    private secondFakeRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            height: 0,
            width: 0,
        };
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
    };

    render() {
        const { children, className, second, ref } = this.props;
        const { width, height } = this.state;
        const firstChild = Array.isArray(children) ? children[0] : undefined;
        const secondChild = Array.isArray(children) ? children[1] : undefined;
        return (
            <React.Fragment>
                <div className={className} ref={ref}>
                    <SwapContainer
                        second={second}
                        width={width}
                        height={height}
                    >
                        {children}
                    </SwapContainer>
                </div>
                <FakeContainer ref={this.firstFakeRef}>
                    {firstChild}
                </FakeContainer>
                <FakeContainer ref={this.secondFakeRef}>
                    {secondChild}
                </FakeContainer>
            </React.Fragment>
        );
    }
}

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <OpacitySwap {...props} ref={ref as any} />
    )
);
