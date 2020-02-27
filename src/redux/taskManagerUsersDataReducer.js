import {USERSDATA_LOADING, USERSDATA_SET, USERSDATA_ERROR, 
        ADD_NEW_USER, ADD_NEW_TASK, 
        DELETE_TASK, EDIT_TASK, SWITCH_USER_STATUS, REMEMBER_LAST_URL} from './actionCreators';
import {LOCAL_STORAGE_STRING, 
        checkLocalStorageIsLoggedIn, 
        memoriseUserInLS} from '../components/_functionsAndConstants';

const initState = {
  users: [],//массив хэшей-данных о users
  mode: 1,//1 - загрузка, 2 - ошибка, 3 - данные получены
  isLoggedIn: {userName: null, userPassword: null},//логин, пароль пользователя или null, null
  lastVisitedUrl: '/',
};

function taskManagerUsersDataReducer(state = initState, action) {
  switch(action.type) {
    case USERSDATA_LOADING: {
      let newState = {...state, mode: 1};
      return newState;
    };
    case USERSDATA_ERROR: {
      let newState = {...state, mode: 2};
      return newState;
    };
    case USERSDATA_SET: {      
      //проверить в localStorage, залогинен ли кто-то
      let isLoggedIn = checkLocalStorageIsLoggedIn (LOCAL_STORAGE_STRING, action.users);
      if(!isLoggedIn)
        isLoggedIn = {...state.isLoggedIn};
      let newState = {...state, users: action.users, mode: 3, isLoggedIn: isLoggedIn};
      return newState;
    };
    case ADD_NEW_USER: {
      memoriseUserInLS(action.isLoggedIn.userName, action.isLoggedIn.userPassword);
      let newState = {...state, users: action.usersData, isLoggedIn: action.isLoggedIn};
      return newState;
    };    
    case ADD_NEW_TASK: {
      let newState = {...state, users: action.usersData};
      return newState;
    };
    case DELETE_TASK: {
      let newState = {...state, users: action.usersData};
      return newState;
    };
    case EDIT_TASK: {
      let newState = {...state, users: action.usersData};
      return newState;
    };
    case SWITCH_USER_STATUS: {
      //записать в localStorage
      memoriseUserInLS(action.userStatus.userName, action.userStatus.userPassword);      
      let newState = {...state, isLoggedIn: action.userStatus};
      return newState;
    };
    case REMEMBER_LAST_URL: {      
      let newState = {...state, lastVisitedUrl: action.url};
      return newState;
    };
    default: {return state}
  };
};

export default taskManagerUsersDataReducer;



