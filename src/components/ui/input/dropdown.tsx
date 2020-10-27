import * as React from 'react';
import styled from 'styled-components';

import DropdownArrowIcon from '../icons/dropdown-arrow';

interface DropdownProps {
    visible: boolean;
}

const DropdownButtonContainer = styled.div<DropdownProps>`
    width: 100%;
    position: relative;
    display: inline-block;

    border: 2px solid ${({ theme, visible }) => visible ? 'gray' : theme.colors.gray};
    & :active, :focus {
        outline: none;
    }
    
`;

const DropdownSelect = styled.select`
    width: 100%;
    height: 100%;
    border: none;
    background: white;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    & :active, :focus {
        outline: none;
    }
    padding: 1rem;
    cursor: pointer;
`;

const DropdownItem = styled.option`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    padding: 1rem;
    cursor: pointer;
`;

const Label = styled.span`
    position: absolute;
    color: warmGray;
    font-size: 0.8rem;
    top: -0.6rem;
    background-color: white;
    padding: 0 0.3rem;
    margin-left: 0.3rem;
`;

const Arrow = styled(DropdownArrowIcon)`
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    margin-top: 15px;
    pointer-events: none;
`;

interface Props {
    content: string[];
    onSelect: (value: string) => void;
    label: string;
    selected: string;
}

interface State {
    maxWidth: number;
    visible: boolean;
}

export default class DropdownButton extends React.Component<Props, State> {
    private selectRef = React.createRef<HTMLSelectElement>();
    constructor(props: Props) {
        super(props);

        this.state = {
            maxWidth: 0,
            visible: false,
        }
    }

    componentDidMount = () => {
        this.selectRef.current?.addEventListener('focusout', this.onFocusOut);
    }

    componentWillUnmount = () => {
        this.selectRef.current?.removeEventListener('focusout', this.onFocusOut);
    }

    onFocusOut = (event: FocusEvent) => {
        this.setState({ visible: false });
    }

    onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.onSelect(e.currentTarget.value);
        this.setState({ visible: false });
    }

    select = () => {
        this.setState({ visible: true });
    }

    render() {
        const {
            content,
            label,
            selected,
        } = this.props;
        const {
            visible
        } = this.state;

        return (
            <DropdownButtonContainer
                visible={visible}
                onClick={this.select}
            >
                <Label>{label}</Label>
                <Arrow
                    height={15}
                    width={15}
                />
                <DropdownSelect
                    ref={this.selectRef}
                    onChange={this.onSelect}
                    value={selected}
                >
                    <DropdownItem value={''} />
                    {content.map((val: string, i: number) => <DropdownItem key={i} value={val}>{val}</DropdownItem>)}
                </DropdownSelect>
            </DropdownButtonContainer >
        );
    }
}