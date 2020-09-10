import * as adminActions from './admin/actions';
import * as sentencesActions from './contribute/actions';
import * as statsActions from './stats/actions';
import * as uiActions from './ui/actions';
import * as userActions from './user/actions';

export default {
   ...adminActions,
   ...sentencesActions,
   ...statsActions,
   ...uiActions,
   ...userActions,
};