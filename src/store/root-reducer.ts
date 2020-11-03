import { combineReducers } from 'redux';
import adminReducer from './admin/reducer';
import contributeReducer from './contribute/reducer';
import statsReducer from './stats/reducer';
import uiReducer from './ui/reducer';
import userReducer from './user/reducer';

export default combineReducers({
    admin: adminReducer,
    contribute: contributeReducer,
    stats: statsReducer,
    ui: uiReducer,
    user: userReducer,
});
