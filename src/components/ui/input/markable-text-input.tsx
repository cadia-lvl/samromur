import * as React from 'react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/global';
import TextInput from './text';

interface ErrorWrapperProps {
    error: boolean;
}

const MarkableWrapper = styled.div<ErrorWrapperProps>`
    ${({ error }) =>
        error
            ? `color: ${theme.colors.red}; \
        font-weight: 600; \
        input { \
            color: ${theme.colors.red}; \
            font-weight: 600; \
        }         \
        font-weight: 600;`
            : ''}
`;

interface Props {
    error: boolean;
    label: string;
    onChange: any;
    placeholder: string;
    type?: string;
}

const MarkableTextInput: FunctionComponent<Props> = ({
    error,
    label,
    onChange,
    placeholder,
    type,
}) => {
    return (
        <MarkableWrapper error={error}>
            <TextInput
                label={label}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
            ></TextInput>
        </MarkableWrapper>
    );
};

export default MarkableTextInput;
