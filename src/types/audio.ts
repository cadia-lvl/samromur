export const audioFormat = 'audio/wav';

export interface AudioInfo {
    url: string;
    blob?: Blob;
}

export interface BlobEvent extends Event {
    data: Blob;
}

export enum RecordingError {
    TOO_SHORT = 'TOO_SHORT',
    TOO_LONG = 'TOO_LONG',
    TOO_QUIET = 'TOO_QUIET',
}

export enum AudioError {
    NOT_ALLOWED = 'NOT_ALLOWED',
    NO_MIC = 'NO_MIC',
    NO_SUPPORT = 'NO_SUPPORT',
}