import { AudioInfo } from './audio';
import { SimpleSentence } from './sentences';
import { RecordingError } from './audio';

export enum UploadError {
    NO_RECORDING = 'NO_RECORDING',
    UPLOAD_FAILED = 'UPLOAD_FAILED',
}

export interface Clip {
    id?: number;
    recording?: AudioInfo;
    sentence: SimpleSentence;
}

export interface ClipMetadata {
    id?: number;
    sentence: string;
    gender: string;
    dialect?: string;
    age: string;
    nativeLanguage: string;
    status?: string;
    userAgent: string;
}

export interface WheelClip extends Clip {
    clipId?: number;
    isVerification?: boolean;
    recordingError?: RecordingError;
    removed?: boolean;
    uploaded?: boolean;
    uploadError?: UploadError;
    vote?: ClipVote;
    voteId?: number;
}

export enum ClipVote {
    INVALID = 'INVALID',
    UNSURE = 'UNSURE',
    VALID = 'VALID',
}
