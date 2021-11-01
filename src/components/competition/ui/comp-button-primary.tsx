import styled from 'styled-components';
import * as colors from './colors';

interface ButtonProps {
    disabled?: boolean;
}

const PrimaryButton = styled.button<ButtonProps>`
    border: none;
    background-color: white;
    color: ${colors.siminn};
    font-weight: bold;
    /* padding: 0.25rem 1rem;
    border-radius: 3px; */
    transition: color 50ms ease-in-out;

    padding: 1rem 5rem;
    border-radius: 0.1rem;
    /* margin: auto; */

    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};

    & :hover {
        ${({ disabled }) =>
            disabled
                ? ''
                : ` color: white;
                    background-color: ${colors.siminn};`}
    }

    & :active {
        transform: translateY(2px);
    }
`;

PrimaryButton.defaultProps = {
    disabled: false,
};

export default PrimaryButton;
