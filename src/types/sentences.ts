export interface Sentence {
    id?: string;
    text: string;
    createdAt: number;
    batchId: string;
    source: string;
    clipCount?: number;
    isUsed?: boolean;
    targetGroup?: string;
}

export interface SimpleSentence {
    id: string;
    text: string;
}

export interface WheelSentence extends SimpleSentence {
    removed?: boolean;
    hasClip?: boolean;
}

export interface SentenceBatch {
    name: string;
    file: {
        name: string;
        size: number;
        text: string;
    };
}

export interface SimpleSentenceBatch {
    name: string;
    sentences: Array<string>;
}

export interface SentenceGroupInfo {
    count: number;
    batch: string;
    //areUsed: number;
    //haveClips: number;
}

export interface SentenceBatchResponse {
    id: string;
    count: number;
    valid: boolean;
}