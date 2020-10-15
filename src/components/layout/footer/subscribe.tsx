import * as React from 'react';
import styled from 'styled-components';

import * as userApi from '../../../services/user-api';

import SubscribeIcon from '../../ui/icons/subscribe';

const SubscribeContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`

const SubscribeText = styled.label`
    font-size: 0.8rem;
    text-transform: uppercase;
`;

const InputWithButton = styled.form`
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

const SubmitButton = styled.button`
    background-color: ${({ theme }) => theme.colors.blue};
    text-align: center;
    width: 1.8rem;
    cursor: pointer;

    border: none;
    :active {
        transform: translateY(2px);
        outline: none;
    }
    :focus {
        outline: none;
    }
`;

const Message = styled.div`
    margin-top: 0.5rem;
    color: white;
    font-weight: 500;
    position: absolute;
    bottom: -1rem;
`;

interface Props {

}

interface State {
    done: boolean;
    email: string;
    success: boolean;
}

export default class SubscribeForm extends React.Component<Props, State> {
    textRef = React.createRef<HTMLInputElement>();
    constructor(props: Props) {
        super(props);

        this.state = {
            done: false,
            email: '',
            success: false,
        }
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.currentTarget.value;
        this.setState({ email });
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email } = this.state;
        userApi.subscribeToNewsletter(email).then(() => {
            this.setState({ done: true, success: true });
        }).catch((error) => {
            this.setState({ done: true, success: false });
        });
    }

    render() {
        const { done, email, success } = this.state;
        return (
            <SubscribeContainer>
                <SubscribeText>Skráning á póstlista Samróms.</SubscribeText>
                <InputWithButton onSubmit={this.handleSubmit}>
                    <TextInput
                        ref={this.textRef}
                        spellCheck='false'
                        placeholder='Tölvupóstfang'
                        className='text-input'
                        value={email}
                        onChange={this.onChange}
                    />
                    <SubmitButton>
                        <SubscribeIcon height={15} width={15} fill={'white'} />
                    </SubmitButton>
                </InputWithButton>
                {
                    done && (
                        <Message>
                            {
                                success ? 'Skráning tókst!' : 'Skráning mistókst'
                            }
                        </Message>
                    )
                }
            </SubscribeContainer>
        );
    }
}