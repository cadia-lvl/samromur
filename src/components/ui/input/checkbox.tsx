import * as React from 'react';
import styled from 'styled-components';
import CheckMarkIcon from '../icons/check-mark';

interface CheckProps {
    active: boolean;
}

const CheckboxContainer = styled.div<CheckProps>`
    height: 2rem;
    width: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.2rem;
    border: 2px solid ${({ active, theme }) => active ? 'black' : theme.colors.borderGray};

    & :hover {
        border: 2px solid black;
    }
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    & :active, :focus {
        outline: none;
    }
`

const CheckMark = styled(CheckMarkIcon) <CheckProps>`
    display: ${({ active }) => active ? 'initial' : 'none'};
`;

interface Props {
    checked: boolean;
    onChange: () => void;
}

export const Checkbox: React.FunctionComponent<Props> = ({ checked, onChange }) => {

    return (
        <CheckboxContainer active={checked} onClick={onChange}>
            <CheckboxInput />
            <CheckMark active={checked} />
        </CheckboxContainer>
    );
}

export default Checkbox;