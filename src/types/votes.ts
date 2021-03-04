export interface Vote {
    clipId: number;
    vote: boolean;
}

export interface VoteBatch {
    votes: Array<Vote>;
}

export interface VoteBatchFile {
    name: string;
    size: number;
    text: string;
}