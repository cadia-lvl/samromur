import { TimelineStat, TimelineSumStat } from '../../types/stats';

export interface StatsState {
    todayClips: number;
    totalClipsClients: number;
    totalClips: number;
    totalValidatedClips: number;
    totalClipsTimeline: TimelineSumStat[];
    weekly: {
        clips: TimelineStat[];
        votes: TimelineStat[];
    };
}
