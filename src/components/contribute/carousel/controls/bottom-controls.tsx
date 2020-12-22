import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import { WheelClip, ClipVote } from '../../../../types/samples';
import RecycleIcon from '../../../ui/icons/recycle-bin';
import SkipIcon from '../../../ui/icons/skip';
import RetryIcon from '../../../ui/icons/retry';
import QuestionMarkIcon from '../../../ui/icons/question-mark';
import InformationIcon from '../../../ui/icons/information';

import ExpandableButton from './expandable-button';
import { InformationModal } from '../information-modal';

const BottomControlsContainer = styled.div`
    width: 100%;
    display: flex;
    height: 4rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    ${({ theme }) => theme.media.extraSmallDown} {
        height: 2 rem;
    }
`;

const SecondaryControls = styled.div`
    display: flex;
    flex-direction: row;
    & > div {
        margin-right: 0.5rem;
    }
`;

const SubmitAndInfoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    & > div {
        margin-left: 0.5rem;
    }
    align-items: center;
`;

interface ButtonProps {
    visible: boolean;
}

const SubmitButton = styled.div<ButtonProps>`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    width: ${({ visible }) => (visible ? '100%' : '0px')};
    min-width: 0;
    max-width: 20rem;
    font-size: 1.1rem;
    border-radius: 2rem;
    padding: ${({ visible }) => (visible ? '0.8rem 1rem' : '0%')};
    background-color: ${({ theme }) => theme.colors.green};
    color: white;
    border: 2px solid ${({ theme }) => theme.colors.green};

    transform: scale(${({ visible }) => (visible ? 1 : 0)});

    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    & :focus {
        outline: none;
    }

    cursor: pointer;
`;

interface Props {
    clip?: WheelClip;
    isDone: boolean;
    isSpeak: boolean;
    progress: number;
    deleteClip: () => void;
    saveVote: (vote: ClipVote) => void;
    skipSentence: () => void;
    handleSubmit: () => void;
    removeRecording: () => Promise<void>;
}

export const BottomControls: React.FunctionComponent<Props> = ({
    clip,
    isDone,
    isSpeak,
    progress,
    deleteClip,
    saveVote,
    skipSentence,
    handleSubmit,
    removeRecording,
}) => {
    const [showInformationModal, setShowInformationModal] = useState(false);
    const hasRecording = !!clip && !!clip.recording;

    const handleInformation = () => {
        setShowInformationModal(!showInformationModal);
    };

    return (
        <BottomControlsContainer>
            <SecondaryControls>
                {isSpeak ? (
                    <React.Fragment>
                        <ExpandableButton
                            stayExpanded={!hasRecording}
                            visible={true}
                            onClickHandler={
                                hasRecording ? deleteClip : skipSentence
                            }
                            text={
                                !hasRecording ? 'Sleppa setningu' : 'Fjarlægja?'
                            }
                        >
                            {!hasRecording ? (
                                <SkipIcon fill="grey" height={30} width={30} />
                            ) : (
                                <RecycleIcon
                                    fill="oliveBlack"
                                    height={30}
                                    width={30}
                                />
                            )}
                        </ExpandableButton>
                        <ExpandableButton
                            visible={hasRecording}
                            onClickHandler={removeRecording}
                            text={'Endurtaka?'}
                        >
                            <RetryIcon fill="grey" height={30} width={30} />
                        </ExpandableButton>
                    </React.Fragment>
                ) : (
                    <ExpandableButton
                        active={clip?.vote == ClipVote.UNSURE}
                        stayExpanded
                        visible={hasRecording}
                        onClickHandler={() => saveVote(ClipVote.UNSURE)}
                        text={'Ég er óviss'}
                    >
                        <QuestionMarkIcon
                            fill={
                                clip?.vote == ClipVote.UNSURE ? 'white' : 'gray'
                            }
                            height={30}
                            width={30}
                        />
                    </ExpandableButton>
                )}
            </SecondaryControls>
            {showInformationModal && (
                <InformationModal
                    isOpen={showInformationModal}
                    isSpeak={isSpeak}
                    onRequestClose={handleInformation}
                />
            )}
            <SubmitAndInfoContainer>
                <SubmitButton visible={progress !== 0} onClick={handleSubmit}>
                    <span>Senda</span>
                </SubmitButton>
                {!isDone && (
                    <ExpandableButton
                        onClickHandler={handleInformation}
                        visible={!isDone}
                        stayExpanded={true}
                        text={''}
                    >
                        <InformationIcon height={30} width={30} fill={'gray'} />
                    </ExpandableButton>
                )}
            </SubmitAndInfoContainer>
        </BottomControlsContainer>
    );
};

export default BottomControls;
