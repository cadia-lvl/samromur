import * as React from 'react';
import styled from 'styled-components';

interface ShowMoreProps {
    active: boolean;
    calculate: boolean;
    height: number;
}

const ShowMoreContainer = styled.div<ShowMoreProps>`
    width: 100%;
    height: auto;
    max-height: ${({ active, calculate, height }) =>
        active ? (!calculate ? '100vh' : `calc(${height}px + 2rem)`) : '0rem'};
    transition: max-height 0.3s ${({ theme }) => theme.transitions.main};
    overflow: hidden;
`;

const FakeChildren = styled.div`
    position: absolute;
    opacity: 0;
    pointer-events: none;
`;

interface Props {
    active: boolean;
    calculate?: boolean;
    children: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
}

interface State {
    height: number;
}

class ShowMore extends React.Component<Props, State> {
    private fakeChildrenRef = React.createRef<HTMLDivElement>();
    constructor(props: Props) {
        super(props);

        this.state = {
            height: 0,
        };
    }

    componentDidMount = () => {
        if (this.props.calculate) {
            const height = this.fakeChildrenRef.current?.clientHeight as number;
            this.setState({ height });
        }
    };

    render() {
        const { active, calculate, className, children, ref } = this.props;
        const { height } = this.state;
        return (
            <React.Fragment>
                <ShowMoreContainer
                    active={active}
                    calculate={!!calculate}
                    className={className}
                    height={height}
                    ref={ref}
                >
                    {children}
                </ShowMoreContainer>
                {calculate && (
                    <FakeChildren ref={this.fakeChildrenRef}>
                        {children}
                    </FakeChildren>
                )}
            </React.Fragment>
        );
    }
}

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <ShowMore {...props} ref={ref as any} />
    )
);
