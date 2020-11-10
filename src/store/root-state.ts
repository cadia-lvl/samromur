import { AdminState } from './admin/state';
import { ContributeState } from './contribute/state';
import { StatsState } from './stats/state';
import { UIState } from './ui/state';
import { UserState } from './user/state';

export default interface RootState {
    admin: AdminState;
    contribute: ContributeState;
    stats: StatsState;
    ui: UIState;
    user: UserState;
}
