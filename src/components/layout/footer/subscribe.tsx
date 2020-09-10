import * as React from 'react';
import styled from 'styled-components';
import { IconButton } from '../../ui/buttons';

const SubscribeContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const SubscribeText = styled.label`
    font-size: 0.8rem;
    text-transform: uppercase;
`;

const InputWithButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.blue};
`;

const TextInput = styled.input`
    flex: 1;
    text-align: left;
    resize: none;
    border: 1px solid #cacccd;
    &:focus {
        outline: none;
    }
    font-size: 1rem;
    padding: 0.2rem;
    font-family: ${({ theme }) => theme.fonts.transcript};
`;

const SubmitButton = styled.div`
    background-color: ${({ theme }) => theme.colors.blue};
    text-align: center;
    width: 1.8rem;
`;

interface Props {

}

interface State {
    email: string;
}

export default class SubscribeForm extends React.Component<Props, State> {
    textRef = React.createRef<HTMLInputElement>();
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
        }
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.currentTarget.value;
        this.setState({ email });
    }

    render() {
        const { email } = this.state;
        return (
            <SubscribeContainer>
                <SubscribeText>Skráning á póstlista Samróms.</SubscribeText>
                <InputWithButton>
                    <TextInput
                        type={'email'}
                        ref={this.textRef}
                        spellCheck='false'
                        placeholder='Tölvupóstfang'
                        className='text-input'
                        value={email}
                        onChange={this.onChange}
                    />
                    <SubmitButton>
                        <IconButton icon={{ height: 15, width: 15, fill: "white" }} onClickHandler={() => { }} type="subscribe" />
                    </SubmitButton>
                </InputWithButton>
            </SubscribeContainer>
        );
    }
}