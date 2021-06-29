import { Goal } from '../../types/contribute';

export interface ContributeState {
    expanded: boolean;
    gaming: boolean;
    goal?: Goal;
    progress: number;
    totalSpoken: number;
    totalRepeated: number;
    totalVerified: number;
    hasPlayedRepeatClip: boolean;
}
