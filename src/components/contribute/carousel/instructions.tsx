import * as React from 'react';
import styled from 'styled-components';
import { RecordingError, AudioError } from '../../../types/audio';
import { UploadError, WheelClip } from '../../../types/samples';

const InstructionsContainer = styled.div`
    width: 100%;
    text-align: center;
    margin: 1rem;
    ${({ theme }) => theme.media.extraSmallDown} {
        margin: 0.2rem;
    }
`;

const NoSelect = styled.div`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;
const Message = styled(NoSelect)`
    font-size: 1rem;
`;

const Error = styled(NoSelect)`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.red};
`;

interface Props {
    activeClip?: WheelClip;
    isSpeak: boolean;
    recordingError?: RecordingError;
    audioError?: AudioError;
    uploadError?: UploadError;
}

export const Instructions: React.FC<Props> = ({
    activeClip,
    isSpeak,
    recordingError,
    audioError,
    uploadError,
}) => {
    const getRecordingErrorMessage = (): string => {
        switch (recordingError) {
            case RecordingError.TOO_LONG:
                return 'Upptakan var of löng, reyndu aftur';
            case RecordingError.TOO_SHORT:
                return 'Upptakan var of stutt, reyndu aftur';
            default:
                return 'Upptakan var of lágvær, reyndu aftur';
        }
    };

    const getAudioErrorMessage = (): string => {
        switch (audioError) {
            case AudioError.NOT_ALLOWED:
                return 'Þú þarft að leyfa aðgang að hljóðnemanum.';
            case AudioError.NO_MIC:
                return 'Hljóðnemi fannst ekki';
            default:
                return 'Því miður er ekki stuðningur við þennan vafra að svo stöddu.';
        }
    };

    const getUploadErrorMessage = (): string => {
        switch (uploadError) {
            case UploadError.UPLOAD_FAILED:
                return 'Innsending upptöku mistókst, vinsamlegast reyndu aftur';
            default:
                return 'Innsending upptöku mistókst, vinsamlegast reyndu aftur';
        }
    };

    const verificationInstructions = (): React.ReactNode => {
        return <Message>Hlustaðu á upptökuna og dæmdu hana</Message>;
    };

    const speakInstructions = (): React.ReactNode => {
        return audioError ? (
            <Error>{getAudioErrorMessage()}</Error>
        ) : recordingError ? (
            <Error>{getRecordingErrorMessage()}</Error>
        ) : activeClip ? (
            <Message>Smelltu á örina til að spila upptökuna</Message>
        ) : (
            <Message>Smelltu á hljóðnemann og lestu setninguna upp</Message>
        );
    };

    return (
        <InstructionsContainer>
            {isSpeak ? speakInstructions() : verificationInstructions()}
        </InstructionsContainer>
    );
};

export default Instructions;
