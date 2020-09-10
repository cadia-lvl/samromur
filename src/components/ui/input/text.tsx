import * as React from 'react';
import { TextInput, LabeledInput } from './input';

interface Props {
    label: string;
    onChange: (text: string) => void;
    placeholder: string;
    text?: string;
    type?: string;
}

interface State {
    text: string;
}

export default class Text extends React.Component<Props, State> {
    textRef = React.createRef<HTMLInputElement>();
    constructor(props: Props) {
        super(props);
        this.state = {
            text: '',
        }
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value;
        this.setState({ text });
        this.props.onChange(text);
    }

    render() {
        const { text } = this.state;
        const {
            label,
            placeholder,
            type,
        } = this.props;
        return (
            <LabeledInput label={label}>
                <TextInput
                    type={type ? type : 'text'}
                    ref={this.textRef}
                    spellCheck='false'
                    placeholder={placeholder}
                    className='text-input'
                    value={text}
                    onChange={this.onChange}
                />
            </LabeledInput>
        );
    }
}