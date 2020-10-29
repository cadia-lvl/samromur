import * as React from 'react';
import styled from 'styled-components';
import Modal from '../../modal/modal';
import { Button } from  '../../ui/buttons';

// Styles
const ModalContainer = styled.div`
`;

const ModalTitle = styled.h2`
    text-align: center;
    margin: 2rem 0rem 1rem 0rem;
    `;
    
const ModalMessage = styled.div`
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding-top: 1rem;
    & > div {
        margin: 0 0.5rem;
    }

    ${({ theme }) => theme.media.extraSmallDown} {
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
`;

const StyledButton = styled(Button)`
    vertical-align: middle;
    width: 45%;
    max-height: auto;
    margin-bottom: 1rem;

    ${({ theme }) => theme.media.extraSmallDown} {
        width: 90%;
    }
`;

interface WarningModalProps {
    isOpen: boolean,
    onStay: () => void,
    onExit: () => void
}

export class WarningModal extends React.Component<WarningModalProps> {

    constructor(props: WarningModalProps) {
        super(props);
    }
    
    render() {
        return (
            <ModalContainer>
                <Modal isOpen={this.props.isOpen} onRequestClose={this.props.onStay}>
                    <ModalTitle>Ertu viss?</ModalTitle>
                    <ModalMessage>Ef þú hættir núna glatast það sem þú ert búinn að taka upp.</ModalMessage>
                    <ButtonsContainer>
                        <StyledButton onClick={this.props.onExit} large >Senda in upptökur</StyledButton>
                        <StyledButton onClick={this.props.onStay} large >Halda upptökum áfram</StyledButton>
                    </ButtonsContainer>
                </Modal>
            </ModalContainer>
        )
    }
}