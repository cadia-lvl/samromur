import * as React from 'react';
import styled from 'styled-components';

import { NoSelectDiv } from '../../../ui/containers';

interface ButtonProps {
    visible: boolean;
    active?: boolean;
}

const ExpandableButtonContainer = styled(NoSelectDiv)<ButtonProps>`
    align-items: center;
    position: relative;
    display: flex;
    flex-direction: row;
    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 2rem;
    padding: 0.8rem 0rem;
    padding-left: 1rem;
    background-color: ${({ active }) => (active ? 'gray' : 'white')};
    border: 2px solid
        ${({ active, theme }) => (!active ? theme.colors.borderGray : 'gray')};
    color: ${({ active }) => (!active ? 'gray' : 'white')};

    transform: scale(${({ visible }) => (visible ? 1 : 0)});

    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    & :focus {
        outline: none;
    }

    overflow: hidden;
    cursor: pointer;

    ${({ theme }) => theme.media.extraSmallDown} {
        font-size: 1rem;
        padding: 0.5rem 0rem;
    }
`;

interface ButtonTextProps {
    expanded: boolean;
    textWidth: number;
}

const IconContainer = styled.div`
    padding-right: 1rem;
    ${({ theme }) => theme.media.extraSmallDown} {
        padding: 0rem 0.5rem;
    }
`;

const FakeText = styled.span`
    position: absolute;
    width: auto;
    z-index: -1;
    opacity: 0;
`;

const ButtonText = styled.span<ButtonTextProps>`
    white-space: nowrap;
    width: auto;
    ${({ theme }) => theme.media.small} {
        max-width: ${({ expanded, textWidth }) =>
            expanded ? `${textWidth}px` : '0px'};
        transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    ${({ theme }) => theme.media.smallUp} {
        max-width: ${({ textWidth }) => `${textWidth}px`};
        transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    overflow: hidden;
`;

interface Props {
    active?: boolean;
    children: React.ReactNode;
    onClickHandler: () => void;
    stayExpanded?: boolean;
    text: string;
    visible: boolean;
}

interface State {
    expanded: boolean;
    textWidth: number;
}

export default class ExpandableButton extends React.Component<Props, State> {
    private buttonRef: React.RefObject<HTMLDivElement>;
    private textRef: React.RefObject<HTMLSpanElement>;
    constructor(props: Props) {
        super(props);

        this.state = {
            expanded: !!this.props.stayExpanded,
            textWidth: 0,
        };
        this.buttonRef = React.createRef<HTMLDivElement>();
        this.textRef = React.createRef<HTMLSpanElement>();
    }

    componentDidMount = () => {
        this.calculateWidth();
    };

    componentDidUpdate = (prevProps: Props) => {
        if (this.props.text != prevProps.text) {
            this.calculateWidth();
            this.setState({ expanded: !this.state.expanded });
        }
    };

    calculateWidth = () => {
        if (this.props.text === '') {
            this.setState({ textWidth: 0 });
        } else {
            this.buttonRef.current?.addEventListener(
                'focusout',
                this.onFocusOut
            );
            const textWidth = this.textRef.current?.clientWidth;
            if (textWidth) {
                this.setState({ textWidth });
            }
        }
    };

    componentWillUnmount = () => {
        this.buttonRef.current?.removeEventListener(
            'focusout',
            this.onFocusOut
        );
    };

    handleClick = () => {
        if (this.state.expanded || (window && window.innerWidth >= 1024)) {
            this.props.onClickHandler();
            if (!this.props.stayExpanded) {
                this.setState({ expanded: false });
            }
        } else {
            this.setState({ expanded: true });
        }
    };

    onFocusOut = (event: FocusEvent) => {
        if (!this.props.stayExpanded) {
            this.setState({ expanded: false });
        }
    };

    render() {
        const { active, children, text, visible } = this.props;
        const { expanded, textWidth } = this.state;
        const dirtyPadding = '\xa0\xa0\xa0\xa0\xa0\xa0';
        const paddedText = text + dirtyPadding;
        return (
            <React.Fragment>
                <ExpandableButtonContainer
                    active={active}
                    onClick={this.handleClick}
                    ref={this.buttonRef}
                    tabIndex={-1}
                    visible={visible}
                >
                    <IconContainer>{children}</IconContainer>
                    {text && (
                        <ButtonText expanded={expanded} textWidth={textWidth}>
                            {paddedText}
                        </ButtonText>
                    )}
                </ExpandableButtonContainer>
                <FakeText ref={this.textRef}>{paddedText}</FakeText>
            </React.Fragment>
        );
    }
}
