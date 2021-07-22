import * as React from 'react';
import styled from 'styled-components';
import Modal from '../../modal/modal';
import { Button } from '../../ui/buttons';
import { TipsSpeak } from '../setup/tips/tips-speak';
import { TipsVerify } from '../setup/tips/tips-verify';
import { TipsKeyboard } from '../setup/tips/tips-keyboard';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { ContributeType } from '../../../types/contribute';

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
    max-height: 70vh;
    overflow-y: auto;
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

type Props = InformationModalProps & ReturnType<typeof mapStateToProps>;

class Information extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    getModalMessage = (contributeType: string | undefined) => {
        switch (contributeType) {
            case ContributeType.SPEAK:
                return <TipsSpeak />;
            case ContributeType.LISTEN:
                return <TipsVerify />;
            case ContributeType.REPEAT:
                return <TipsSpeak />;
        }
    };

    render() {
        const { contributeType } = this.props;
        return (
            <ModalContainer>
                <Modal
                    onRequestClose={this.props.onRequestClose}
                    isOpen={this.props.isOpen}
                >
                    <ModalTitle>Góð ráð</ModalTitle>
                    <ModalMessage>
                        {this.getModalMessage(contributeType)}
                        <TipsKeyboard />
                    </ModalMessage>
                    <StyledButton onClick={this.props.onRequestClose}>
                        Loka
                    </StyledButton>
                </Modal>
            </ModalContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const {
        contribute: { goal },
    } = state;
    const { contributeType } = { ...goal };
    return { contributeType };
};

export const InformationModal = connect(mapStateToProps)(Information);
