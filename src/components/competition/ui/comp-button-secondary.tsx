import styled from 'styled-components';
import * as colors from './colors';

interface ButtonProps {
    disabled?: boolean;
}

const SecondaryButton = styled.button<ButtonProps>`
    border: none;
    background-color: ${({ disabled }) => (disabled ? 'gray' : colors.green1)};
    color: ${({ disabled }) => (disabled ? 'white' : colors.blue3)};
    font-weight: bold;
    /* padding: 0.25rem 1rem; */
    /* border-radius: 3px; */
    transition: color 50ms ease-in-out;

    padding: 1rem 5rem;
    border-radius: 0.1rem;
    /* margin: auto; */

    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};

    & :hover {
        ${({ disabled }) =>
            disabled
                ? ''
                : ` color: ${colors.green1};
                    background-color: ${colors.blue3};`}
    }

    & :active {
        transform: translateY(2px);
    }
`;

SecondaryButton.defaultProps = {
    disabled: false,
};

export default SecondaryButton;
