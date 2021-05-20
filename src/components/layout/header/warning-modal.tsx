import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'typesafe-actions';
import { ContributeType } from '../../../types/contribute';
import Modal from '../../modal/modal';
import { Button } from '../../ui/buttons';

// Styles
const ModalContainer = styled.div``;

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
    border-radius: 2rem;

    ${({ theme }) => theme.media.extraSmallDown} {
        width: 90%;
    }
`;

const StyledLeaveButton = styled(StyledButton)`
    background: ${({ theme }) => theme.colors.red};
`;

interface WarningModalProps {
    isOpen: boolean;
    onStay: () => void;
    onExit: () => void;
}

type Props = WarningModalProps & ReturnType<typeof mapStateToProps>;

class WarningModal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    getModalMessage = (
        contributeType: string | undefined,
        progress: any,
        count: any
    ): string => {
        switch (contributeType) {
            case ContributeType.SPEAK:
                return `Þú hefur lokið ${progress}/${count} upptökum.`;
            case ContributeType.LISTEN:
                return `Þú hefur yfirfarið ${progress}/${count} upptökum.`;
            case ContributeType.REPEAT:
                return `Þú hefur lesið inn ${progress}/${count} upptökum.`;
            default:
                return `Þú ert ekki búinn, vinsamlegast haltu áfram.`;
        }
    };

    getButtonText = (contributeType: string | undefined) => {
        switch (contributeType) {
            case ContributeType.SPEAK:
                return `Halda upptökum áfram`;
            case ContributeType.LISTEN:
                return `Halda yfirferðinni áfram`;
            case ContributeType.REPEAT:
                return `Halda upptökum áfram`;
            default:
                return `Haltu áfram`;
        }
    };

    render() {
        const {
            contribute: { progress, goal: { count, contributeType } = {} },
        } = this.props;
        return (
            <ModalContainer>
                <Modal
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.onStay}
                >
                    <ModalTitle>Ertu viss?</ModalTitle>
                    <ModalMessage>
                        {this.getModalMessage(contributeType, progress, count)}
                    </ModalMessage>
                    <ButtonsContainer>
                        <StyledLeaveButton onClick={this.props.onExit} large>
                            Hætta
                        </StyledLeaveButton>
                        <StyledButton onClick={this.props.onStay} large>
                            {this.getButtonText(contributeType)}
                        </StyledButton>
                    </ButtonsContainer>
                </Modal>
            </ModalContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
});

export default connect(mapStateToProps)(WarningModal);
