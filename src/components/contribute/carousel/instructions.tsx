import * as React from 'react';
import styled from 'styled-components';
import { RecordingError, AudioError } from '../../../types/audio';
import { UploadError, WheelClip } from '../../../types/samples';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { setHasPlayedRepeatClip } from '../../../store/contribute/actions';
import { ContributeType } from '../../../types/contribute';
import { useTranslation } from '../../../server/i18n';

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

interface InstructionsProps {
    activeClip?: WheelClip;
    isSpeak: boolean;
    recordingError?: RecordingError;
    audioError?: AudioError;
    uploadError?: UploadError;
}

type Props = InstructionsProps & ReturnType<typeof mapStateToProps>;

const InstructionsFC: React.FC<Props> = ({
    activeClip,
    isSpeak,
    recordingError,
    audioError,
    uploadError,
    contribute,
}) => {
    const { t } = useTranslation('wheel');

    const getRecordingErrorMessage = (): string => {
        switch (recordingError) {
            case RecordingError.TOO_LONG:
                return t('errors.recording-too-long');
            case RecordingError.TOO_SHORT:
                return t('errors.recording-too-short');
            default:
                return t('errors.recording-too-quiet');
        }
    };

    const getAudioErrorMessage = (): string => {
        switch (audioError) {
            case AudioError.NOT_ALLOWED:
                return t('errors.mic-not-allowed');
            case AudioError.NO_MIC:
                return t('errors.mic-not-found');
            default:
                return t('not-supported');
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
        return <Message>{t('instructions.listen-and-judge')}</Message>;
    };

    const speakInstructions = (): React.ReactNode => {
        const { hasPlayedRepeatClip, goal } = contribute;
        return audioError ? (
            <Error>{getAudioErrorMessage()}</Error>
        ) : recordingError ? (
            <Error>{getRecordingErrorMessage()}</Error>
        ) : activeClip ? (
            <Message>{t('instructions.click-arrow-to-play')}</Message>
        ) : hasPlayedRepeatClip ||
          goal?.contributeType !== ContributeType.REPEAT ? (
            <Message>{t('instructions.click-mic-and-read')}</Message>
        ) : (
            <Message>{t('instructions.listen-to-recording')}</Message>
        );
    };

    return (
        <InstructionsContainer>
            {isSpeak ? speakInstructions() : verificationInstructions()}
        </InstructionsContainer>
    );
};

const mapStateToProps = (state: RootState) => {
    const contribute = state.contribute;

    return { contribute };
};
export const Instructions = connect(mapStateToProps)(InstructionsFC);
