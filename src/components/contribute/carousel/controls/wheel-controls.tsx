import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'typesafe-actions';
import { WheelClip } from '../../../../types/samples';
import { WheelColor } from '../../../../types/contribute';
import { getWheelColorString } from '../../../../utilities/color-utility';
import BackIcon from '../../../ui/icons/arrow-left';
import ForwardIcon from '../../../ui/icons/arrow-right';

const WheelControlsContainer = styled.div`
    width: 100%;
    max-width: 75rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const CircleContainer = styled.div<{ hasRecording?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow: 0 0 3px 1px rgba(0,0,0,${({ hasRecording }) => hasRecording ? '.58' : '.08'});
    -moz-box-shadow: 0 0 3px 1px rgba(0,0,0,${({ hasRecording }) => hasRecording ? '.58' : '.08'});
    -webkit-box-shadow: 0 0 3px 1px rgba(0,0,0,${({ hasRecording }) => hasRecording ? '.58' : '.08'});
`

const NumbersWheel = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

interface NumberContainerProps {
    active: boolean;
    color: string;
    hasRecording: boolean;
    isDone: boolean;
    isSpeak: boolean;
    position: number;
    translateX: number;
}

const NumberContainer = styled(CircleContainer).attrs(
    ({ position, translateX }: NumberContainerProps) => ({
        style: {
            transform: `
                translateX(${position * translateX}px)
                scale(${Math.abs(position) >= 3 ? 0 : 1})
            `,
        }
    })) <NumberContainerProps>`
    position: absolute;
    ${({ position }) => Math.abs(position) > 3 && `display: none;`}
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    width: 2.4rem;
    height: 2.4rem;
    background-color: ${({ active, color, theme }) => active ? theme.colors[color] : 'white'};
    color: ${({ active }) => active ? 'white' : 'grey'};
    font-weight: 600;
    border: ${({ hasRecording }) => hasRecording ? '0px' : '0px'} solid ${({ theme }) => theme.colors.blackOlive};
    cursor: pointer;
`

const ArrowContainer = styled(CircleContainer)`
    width: 3rem;
    height: 3rem;
    cursor: pointer;
`;

interface WheelControlsProps {
    index: number;
    isDone: boolean;
    isSpeak: boolean;
    clips: WheelClip[];
    color: WheelColor;
    spinTo: (index: number) => void;
}

interface State {
    translateX: number;
}

type Props = ReturnType<typeof mapStateToProps> & WheelControlsProps;

class WheelControls extends React.Component<Props, State> {
    private wheelRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.wheelRef = React.createRef<HTMLDivElement>();

        this.state = {
            translateX: 0,
        }
    }

    componentDidMount = () => {
        this.setWidth();
        window.addEventListener('resize', this.setWidth);
    }


    componentWillUnmount = () => {
        window.removeEventListener('resize', this.setWidth);
    }

    setWidth = () => {
        const width = this.wheelRef.current?.clientWidth;
        if (width) {
            this.setState({ translateX: width / 6 });
        }
    }

    range = (start: number, count: number) => {
        return Array.apply(0, Array(count))
            .map((element, index) => index + start);
    }

    render() {
        const {
            index,
            isDone,
            isSpeak,
            clips,
            color,
            spinTo,
            contribute: { goal },
        } = this.props;
        const { translateX } = this.state;
        const total = goal?.count || 0;
        const numbers = this.range(1, total);
        return (
            <WheelControlsContainer>
                <ArrowContainer onClick={() => spinTo(-1)}>
                    <BackIcon height={13} width={13} />
                </ArrowContainer>
                <NumbersWheel ref={this.wheelRef}>
                    {numbers.map((val: number, i: number) => {
                        const position =
                            index < 4
                                ? val - 3
                                : index > total - 2
                                    ? val - total + 2
                                    : val - index;
                        return (
                            <NumberContainer
                                active={index == val || index < 1 && val == 1}
                                color={getWheelColorString(color)}
                                hasRecording={!!clips[val - 1] && !!clips[val - 1].recording}
                                isDone={isDone}
                                isSpeak={isSpeak}
                                onClick={() => spinTo(val - index)}
                                position={position}
                                translateX={translateX}
                                key={i}
                            >
                                {val}
                            </NumberContainer>
                        );
                    })}
                </NumbersWheel>
                <ArrowContainer onClick={() => spinTo(1)}>
                    <ForwardIcon height={13} width={13} />
                </ArrowContainer>
            </WheelControlsContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
});

export default connect(
    mapStateToProps,
)(WheelControls);