import styled from 'styled-components';

interface BorderProps {
    active: boolean;
    hasRecording: boolean;
    recordingError: boolean;
    success: boolean;
    uploadError: boolean;
}

export const Border = styled.div<BorderProps>`
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: ${({ active, hasRecording, recordingError, success, uploadError }) => {
        if (recordingError || uploadError) {
            return active ? '100%' : '50%';
        } else if (success) {
            if (!hasRecording) {
                return '0%';
            } else {
                return active ? '60%' : '50%';
            }
        } else {
            return '0%';
        }
    }};
    background-color: ${({ active, hasRecording, recordingError, theme, success, uploadError }) => {
        if (recordingError || uploadError) {
            return !active ? theme.colors.red : 'transparent';
        } else if (success) {
            return !active && hasRecording && theme.colors.green;
        } else {
            return 'transparent';
        }
    }};
    border: 0.3rem solid ${({ hasRecording, recordingError, success, theme, uploadError }) => {
        if (recordingError || uploadError) {
            return theme.colors.red;
        } else if (success) {
            return hasRecording ? theme.colors.green : 'white';
        } else {
            return 'white';
        }
    }};
    transition:
        opacity 1s cubic-bezier(0.4, 0, 0.2, 1),
        background-color 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

export default Border;