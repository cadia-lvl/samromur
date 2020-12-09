import * as React from 'react';
import styled from 'styled-components';
import Modal from '../../modal/modal';
import { Button } from '../../ui/buttons';
import { TipsSpeak } from '../setup/tips/tips-speak';
import { TipsVerify } from '../setup/tips/tips-verify';

// Styles
const ModalContainer = styled.div``;

const ModalTitle = styled.h2`
    text-align: center;
    margin: 2rem 0rem 1rem 0rem;
`;

const ModalMessage = styled.div`
    width: 100%;
    text-align: left;
    margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
    vertical-align: middle;
    width: 45%;
    max-height: auto;
    margin: 1rem 0rem 2rem 0rem;

    ${({ theme }) => theme.media.extraSmallDown} {
        width: 90%;
    }
`;

interface InformationModalProps {
    isOpen: boolean;
    isSpeak: boolean;
    onRequestClose: () => void;
}

export class InformationModal extends React.Component<InformationModalProps> {
    constructor(props: InformationModalProps) {
        super(props);
    }

    render() {
        const { isSpeak } = this.props;
        return (
            <ModalContainer>
                <Modal
                    onRequestClose={this.props.onRequestClose}
                    isOpen={this.props.isOpen}
                >
                    <ModalTitle>Góð ráð</ModalTitle>
                    <ModalMessage>
                        {isSpeak ? <TipsSpeak /> : <TipsVerify />}
                    </ModalMessage>
                    <StyledButton onClick={this.props.onRequestClose}>
                        Loka
                    </StyledButton>
                </Modal>
            </ModalContainer>
        );
    }
}
