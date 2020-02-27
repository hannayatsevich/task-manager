import isoFetch from 'isomorphic-fetch';
import {createUsersTasksInfo, getNewTaskObject} from '../components/_functionsAndConstants';
const USERSDATA_LOADING = 'USERSDATA_LOADING';
const USERSDATA_SET = 'USERSDATA_SET';
const USERSDATA_ERROR = 'USERSDATA_ERROR';
const ADD_NEW_USER = 'ADD_NEW_USER';
const ADD_NEW_TASK = 'ADD_NEW_TASK';
const DELETE_TASK = 'DELETE_TASK';
const EDIT_TASK = 'EDIT_TASK';
const SWITCH_USER_STATUS = 'SWITCH_USER_STATUS';
const REMEMBER_LAST_URL = 'REMEMBER_LAST_URL';

let ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
let stringName='YATSEVICH_TASK_MANAGER';
let formDataRead = new FormData();
formDataRead.append('f','READ');
formDataRead.append('n', stringName);
let formDataLockget = new FormData();
formDataLockget.append('f','LOCKGET');
formDataLockget.append('n', stringName);
let formDataUpdate = new FormData();
formDataUpdate.append('f','UPDATE');
formDataUpdate.append('n', stringName);
//data : { f : 'READ', n : stringName },
//cache : false, 
//dataType:'json', 

function getUsersDataThunkAC(dispatch) {//при первой загрузке
  return function () {
    dispatch(usersDataLoadingAC());
    isoFetch(ajaxHandlerScript, {
      method : 'POST', 
      body: formDataRead, 
      dataType:'json',    
    })
      .then((response) => { // response - HTTP-ответ
        if (!response.ok) {
          let Err = new Error(`fetch error ${response.status}`);
          Err.userMessage =  "Ошибка связи";
          throw Err;
        }
        else
          return response.json();        
      })
      .then( (data) => {
        if ( data.error !== undefined )
          throw data.error;
        else if ( data.result !== "" ) {
          let info = JSON.parse(data.result);
          if(Array.isArray(info)) {
              dispatch(userDataSetAC(info));
          }
          else {
            let Err = new Error("fetch error");
            Err.userMessage = 'data.result is not Array';
            throw Err;
          };
        };
      })
      .catch( (error) => {
          console.error(error);
          dispatch(userDataSetErrorAC());
      });
  };
};

//передать хэш с ключами 'action' и 'data'
function getUsersDataThunkForActionAC(dispatch, actionDataObject) {//при добавлении/удалении/редактировании
  return function () {
    let psw = Math.random();
    formDataLockget.set('p', psw);
    isoFetch(ajaxHandlerScript, {
      method : 'POST', 
      body: formDataLockget, 
      dataType:'json',    
    })
      .then((response) => { // response - HTTP-ответ
        if (!response.ok) {
          let Err = new Error(`fetch error ${response.status}`);
          Err.userMessage =  "Ошибка связи";
          throw Err;
        }
        else
          return response.json();        
      })
      .then( (data) => {
        if ( data.error !== undefined )
          throw data.error;
        else if ( data.result !== "" ) {
          let usersArray = JSON.parse(data.result);
          if(Array.isArray(usersArray)) {
            let changedArray;
            if(actionDataObject.action === ADD_NEW_USER) {
              changedArray = createNewUsersArray(usersArray, actionDataObject.data, actionDataObject.action);
              dispatch(addNewUserAC(changedArray, {userName: actionDataObject.data.userName, userPassword: actionDataObject.data.userPassword}));                           
            }
            else if(actionDataObject.action === ADD_NEW_TASK || actionDataObject.action === DELETE_TASK || actionDataObject.action === EDIT_TASK) {
              changedArray = createNewUsersTasksArray(usersArray, actionDataObject.data, actionDataObject.action);
              if(actionDataObject.action === ADD_NEW_TASK) 
                dispatch(addNewTaskAC(changedArray));
              else if(actionDataObject.action === DELETE_TASK) 
                dispatch(deleteTaskAC(changedArray));
              else
                dispatch(editTaskAC(changedArray));              
            };
            setUsersDataThunk(JSON.stringify(changedArray), psw);
          }
          else {
            let Err = new Error("fetch error");
            Err.userMessage = 'data.result is not Array';
            throw Err;
          };
        };
      })
      .catch( (error) => {
          console.error(error);
      });
  };
};

function setUsersDataThunk(changedArray, password) {
  formDataUpdate.set('p', password);
  formDataUpdate.set('v', changedArray);
  isoFetch(ajaxHandlerScript, {
    method : 'POST', 
    body: formDataUpdate, 
    dataType:'json',    
  })
    .then((response) => { // response - HTTP-ответ
      if (!response.ok) {
        let Err = new Error(`fetch error ${response.status}`);
        Err.userMessage =  "Ошибка связи";
        throw Err;
      }
      else
        return response.json();        
    })
    .then( (data) => {
      if ( data.error !== undefined )
        throw data.error;      
    })
    .catch( (error) => {
        console.error(error);
    });
};


const usersDataLoadingAC = function() {
  return {
    type: USERSDATA_LOADING,
  }
};
const userDataSetAC = function(users) {
  return {
    type: USERSDATA_SET,
    users: users,
  }
};
const userDataSetErrorAC = function() {
  return {
    type: USERSDATA_ERROR,
  }
};
const addNewUserAC = function (usersData, userLoggedin){
  return {
    type: ADD_NEW_USER,
    usersData: usersData,
    isLoggedIn: userLoggedin,
  }
};
const addNewTaskAC = function (usersData){
  return {
    type: ADD_NEW_TASK,
    usersData: usersData,
  }
};
const deleteTaskAC = function (usersData){
  return {
    type: DELETE_TASK,
    usersData: usersData,
  }
};
const editTaskAC = function (usersData){
  return {
    type: EDIT_TASK,
    usersData: usersData,
  }
};
const switchUserStatusAC = function (userName, userPsw){
  return {
    type: SWITCH_USER_STATUS,
    userStatus: {userName: userName, userPassword: userPsw},
  };
};
const rememberLastUrlAC = function (url){
  return {
    type: REMEMBER_LAST_URL,
    url: url,
  }
};

function createNewUsersArray(usersArray, userObject, action) {
  switch(action) {
    case ADD_NEW_USER:     
      let check = usersArray.find( element => element.userName === userObject.userName);
      if(!check) {
        usersArray.push(userObject);
        return usersArray;
      }
      else
        return usersArray;
    default: return usersArray;
  };
};
//actionDataObject:
//add - userName, formData
//edit - userName, taskObject
//delete - userName, tasksArray
function createNewUsersTasksArray(usersArray, actionDataObject, action) {
  switch(action) {
    case ADD_NEW_TASK: {
      let usersTasksInfo = createUsersTasksInfo(usersArray);
      let taskObject = getNewTaskObject(usersTasksInfo, actionDataObject.userName, actionDataObject.formData);
      let indexOfUser = usersArray.findIndex( element => element.userName === actionDataObject.userName);
      usersArray[indexOfUser].userTasks.push(JSON.parse(JSON.stringify(taskObject)));
      return usersArray;
    };
    case DELETE_TASK: {
      let indexOfUser = usersArray.findIndex( element => element.userName === actionDataObject.userName);
      let indexesOfTasksForDelete = [];
      usersArray[indexOfUser].userTasks.forEach((element, index) => {        
        for(let i = 0; i < actionDataObject.tasksArray.length; i++) {          
          if(element.taskID === actionDataObject.tasksArray[i].taskID)
            indexesOfTasksForDelete.push(index);           
        };       
      });
      let newUserTasksArray = usersArray[indexOfUser].userTasks.filter((element, index) => {
        let match = true;
        for(let i = 0; i < indexesOfTasksForDelete.length; i++) {          
          if(index === indexesOfTasksForDelete[i])
            match = false;
        };  
        return match;       
      });
      usersArray[indexOfUser].userTasks = newUserTasksArray;
      return usersArray;
    };
    case EDIT_TASK: {
      let indexOfUser = usersArray.findIndex( element => element.userName === actionDataObject.userName);
      let indexOfTask = usersArray[indexOfUser].userTasks.findIndex(element => element.taskID === actionDataObject.taskObject.taskID);
      usersArray[indexOfUser].userTasks[indexOfTask] = JSON.parse(JSON.stringify(actionDataObject.taskObject));
      return usersArray;
    };
    default: return usersArray;
  };
};

export {
  getUsersDataThunkAC, USERSDATA_LOADING, USERSDATA_SET, USERSDATA_ERROR,
  userDataSetAC,
  getUsersDataThunkForActionAC,
  addNewUserAC, ADD_NEW_USER,
  addNewTaskAC, ADD_NEW_TASK,
  deleteTaskAC, DELETE_TASK,
  editTaskAC, EDIT_TASK,
  switchUserStatusAC, SWITCH_USER_STATUS,
  rememberLastUrlAC, REMEMBER_LAST_URL,
};