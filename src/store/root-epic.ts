import { combineEpics } from 'redux-observable';

import * as adminEpics from './admin/epics';
import * as contributeEpics from './contribute/epics';
import * as statsEpics from './stats/epics';
import * as userEpics from './user/epics';

export default combineEpics(
    ...Object.values(adminEpics),
    ...Object.values(contributeEpics),
    ...Object.values(statsEpics),
    ...Object.values(userEpics)
);
