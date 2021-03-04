import { ClipVote } from './samples';

export interface Vote {
    clipId: number;
    vote: ClipVote;
}

export interface VoteBatch {
    votes: Array<Vote>;
}

export interface VoteBatchFile {
    name: string;
    size: number;
    text: string;
}
