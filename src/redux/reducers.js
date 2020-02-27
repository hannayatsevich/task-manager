import {combineReducers} from 'redux';
import taskManagerUsersDataReducer from './taskManagerUsersDataReducer';

let combinedRedusers = combineReducers({
  taskManagerUsersData: taskManagerUsersDataReducer, //отвечает за раздел state под именем taskManagerUsersData
});

export default combinedRedusers;