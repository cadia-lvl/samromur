export interface Vote {
    clipId: number;
    vote: boolean;
}

export interface VoteBatch {
    votes: Array<Vote>;
}
