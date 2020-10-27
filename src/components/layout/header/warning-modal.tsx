import * as React from 'react';
import styled from 'styled-components';
import Modal from '../../modal/modal';
import { Button } from  '../../ui/buttons';

// Styles
const ModalTitle = styled.h2`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

const ModalMessageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding-top: 1rem;
    & > div {
        margin: 0 0.5rem;
    }
`;


interface WarningModalProps {
    isOpen: boolean,
    onStay: () => void,
    onExit: () => void
}

export const WarningModal: React.FC<WarningModalProps> = (props) => {
    return (
        <Modal isOpen={props.isOpen} onRequestClose={props.onStay}>
            <ModalTitle>Ertu viss?</ModalTitle>
            <ModalMessageContainer>Ef þú hættir núna glatast það sem þú ert búinn að taka upp.</ModalMessageContainer>
            <ButtonsContainer>
                <Button onClick={props.onExit} medium color={"red"}>Hætta</Button>
                <Button onClick={props.onStay} medium color={"blue"}>Halda upptökum áfram</Button>
            </ButtonsContainer>
        </Modal>
    )
}