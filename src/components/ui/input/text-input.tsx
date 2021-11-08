import * as React from 'react';
import styled from 'styled-components';

interface InputProps {
    active: boolean;
}

const InputContainer = styled.div<InputProps>`
    position: relative;
    width: 100%;
    border: 2px solid
        ${({ active, theme }) => (active ? 'black' : theme.colors.borderGray)};
    & :active,
    :focus {
        outline: none;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active,
    input:-webkit-autofill::first-line {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
        font-size: 1rem !important;
    }
`;

const TextInputContainer = styled.input`
    width: 100%;
    height: 100%;
    border: none;

    appearance: textfield;
    -webkit-appearance: textfield;
    -moz-appearance: textfield;

    & :active,
    :focus {
        outline: none;
    }
    padding: 1rem;

    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`;

const Label = styled.span`
    position: absolute;
    color: gray;
    font-size: 0.8rem;
    top: -0.6rem;
    background-color: white;
    padding: 0 0.3rem;
    margin-left: 0.3rem;
`;

interface TextInputProps {
    className?: string;
    label: string;
    ref?: React.Ref<HTMLDivElement>;
}

interface State {
    active: boolean;
}

type Props = TextInputProps & React.InputHTMLAttributes<HTMLInputElement>;

class TextInput extends React.Component<Props, State> {
    private selectRef = React.createRef<HTMLSelectElement>();
    constructor(props: Props) {
        super(props);

        this.state = {
            active: false,
        };
    }

    componentDidMount = () => {
        this.selectRef.current?.addEventListener('focusout', this.onFocusOut);
    };

    componentWillUnmount = () => {
        this.selectRef.current?.removeEventListener(
            'focusout',
            this.onFocusOut
        );
    };

    onFocusOut = (event: FocusEvent) => {
        this.setState({ active: false });
    };

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ active: false });
    };

    select = () => {
        this.setState({ active: true });
    };

    render() {
        const { className, label, ref } = this.props;

        const { active } = this.state;

        return (
            <InputContainer active={active} className={className}>
                <Label>{label}</Label>
                <TextInputContainer
                    {...(this
                        .props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            </InputContainer>
        );
    }
}

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <TextInput {...props} ref={ref as any} />
    )
);
