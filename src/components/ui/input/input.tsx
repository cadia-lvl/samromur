import { FunctionComponent } from 'react';
import styled from 'styled-components';

export const TextInput = styled.input`
    text-align: left;
    resize: none;
    border: 1px solid #cacccd;
    &:focus {
        outline: none;
    }
    font-size: 1rem;
    padding: 0.5rem;
    font-family: ${props => props.theme.fonts.transcript};
    margin-bottom: 2rem;
`;

const LabeledInputContainer = styled.div`
    font-family: ${props => props.theme.fonts.transcript};
    display: flex;
    flex-direction: column;
`;

const Label = styled.p`
    margin: 0;
    margin-bottom: 0.5rem;
`;

export const LabeledInput: FunctionComponent<any> = (props) => {
    return (
        <LabeledInputContainer>
            <Label>
                {props.label}
            </Label>
            {props.children}
        </LabeledInputContainer>
    );
}

export const TextInputWithLabel: FunctionComponent<any> = (props) => {
    return (
        <LabeledInputContainer>
            <Label>
                {props.label}
            </Label>
            <TextInput {...props} />
        </LabeledInputContainer>
    );
}