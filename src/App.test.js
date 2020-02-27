
import React from 'react';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { TaskComponent } from './components/TaskComponent';
import ConnectedLogInView from './components/LogInView';
import {LogInView} from './components/LogInView';
import { getNumbersFromDate, getDateString, getDateFromString, getInitialFormData, 
        validateTaskData, getActionDataObject, escapeHTML, validateLogInData } from './components/_functionsAndConstants';
import {deleteTaskAC, editTaskAC, switchUserStatusAC, DELETE_TASK, EDIT_TASK, SWITCH_USER_STATUS} from './redux/actionCreators';
import taskManagerUsersDataReducer from './redux/taskManagerUsersDataReducer';
        
let data = require('./data.json');

describe('TaskComponent functions', () => {
  it('check getNumbersFromDate', () => {
    let inpit1 = new Date(2019, 1, 1);
    let output1 = {yearNum: 2019, monthNum: 2, dayNum: 1};
    let inpit2 = new Date(1990, 3, 27);
    let output2 = {yearNum: 1990, monthNum: 4, dayNum: 27};
      
    expect(getNumbersFromDate(inpit1)).toEqual(output1);
    expect(getNumbersFromDate(inpit2)).toEqual(output2);
  });
  it('check getDateString', () => {
    let inpit1 = new Date(2019, 1, 1);
    let output1 = '01.02.2019';
    let inpit2 = new Date(1990, 3, 27);
    let output2 = '27.04.1990';
      
    expect(getDateString(inpit1)).toEqual(output1);
    expect(getDateString(inpit2)).toEqual(output2);
  });
  it('check getDateFromString', () => {
    let taskDate1 = '01.02.2019';
    let taskDate2 = '05.07.2020';
    let taskDateOutput1 = new Date(2019, 1, 1);
    let taskDateOutput2 = new Date(2020, 6, 5);

    expect(getDateFromString(taskDate1)).toEqual(taskDateOutput1);
    expect(getDateFromString(taskDate2)).toEqual(taskDateOutput2);
  });
  it('check escapeHTML', () => {
    let text1 = null;
    let text2 = 'text';
    let text3 = '&text';
    let text4 = '<text';
    let text5 = '>text';
    let text6 = '"text';
    let text7 = "'text";
    let output1 = null;
    let output2 = 'text';
    let output3 = '&amp;text';
    let output4 = '&lt;text';
    let output5 = '&gt;text';
    let output6 = '&quot;text';
    let output7 = "&#039;text";

    expect(escapeHTML(text1)).toBe(output1);
    expect(escapeHTML(text2)).toBe(output2);
    expect(escapeHTML(text3)).toBe(output3);
    expect(escapeHTML(text4)).toBe(output4);
    expect(escapeHTML(text5)).toBe(output5);
    expect(escapeHTML(text6)).toBe(output6);
    expect(escapeHTML(text7)).toBe(output7);
  });
  it('check getInitialFormData', () => {
    let taskDate1 = '01/02/2019';
    //let taskDate2 = '05.07.2020';
    let taskDate3 = '11-04-1900';
    let taskDate4 = '31.09.1750';
    let taskDate5 = '07.02.2050';
    let taskName1 = 'Task1#';
    let taskName2 = 'Task2';
    //let taskName3 = 'Task3';
    let taskName4 = 'Task4';
    let taskName5 = 'Task5';
    let taskBody1 = 'TaskBody1';
    let taskBody2 = 'TaskBody2';
    let taskBody3 = 'TaskBody3';
    //let taskBody4 = 'TaskBody4';
    let taskBody5 = 'TaskBody5';
    let taskTags1 = 'Tag1, Tag2, Tag3';
    let taskTags2 = 'Tag4, Tag5, Tag6';
    let taskTags3 = 'Tag7, Tag8, Tag9';
    let taskTags4 = 'Tag10-Tag11-Tag12';
    //let taskTags5 = 'Tag13, Tag14, Tag15';
    let formData1 = {
        dateInputValue: taskDate1,
        dateInputError: null,
        taskNameInputValue: taskName1,
        taskNameInputError: null,
        taskBodyInputValue: taskBody1,
        taskBodyInputError: null,
        taskTagsInputValue: taskTags1,
        taskTagsInputError: null,
      };
      let formData2 = {
        dateInputValue: '',
        dateInputError: null,
        taskNameInputValue: taskName2,
        taskNameInputError: null,
        taskBodyInputValue: taskBody2,
        taskBodyInputError: null,
        taskTagsInputValue: taskTags2,
        taskTagsInputError: null,
      };
      let formData3 = {
        dateInputValue: taskDate3,
        dateInputError: null,
        taskNameInputValue: '',
        taskNameInputError: null,
        taskBodyInputValue: taskBody3,
        taskBodyInputError: null,
        taskTagsInputValue: taskTags3,
        taskTagsInputError: null,
      };
      let formData4 = {
        dateInputValue: taskDate4,
        dateInputError: null,
        taskNameInputValue: taskName4,
        taskNameInputError: null,
        taskBodyInputValue: '',
        taskBodyInputError: null,
        taskTagsInputValue: taskTags4,
        taskTagsInputError: null,
      };
      let formData5 = {
        dateInputValue: taskDate5,
        dateInputError: null,
        taskNameInputValue: taskName5,
        taskNameInputError: null,
        taskBodyInputValue: taskBody5,
        taskBodyInputError: null,
        taskTagsInputValue: '',
        taskTagsInputError: null,
      };

      expect(getInitialFormData(taskDate1, taskName1, taskBody1, taskTags1)).toEqual(formData1);
      expect(getInitialFormData('', taskName2, taskBody2, taskTags2)).toEqual(formData2);
      expect(getInitialFormData(taskDate3, '', taskBody3, taskTags3)).toEqual(formData3);
      expect(getInitialFormData(taskDate4, taskName4, '', taskTags4)).toEqual(formData4);
      expect(getInitialFormData(taskDate5, taskName5, taskBody5, '')).toEqual(formData5);
  });
  it('check validateTaskData', () => {
    let taskDate1 = '01/02/2019';
    //let taskDate2 = '05.07.2020';
    let taskDate3 = '11-04-1900';
    let taskDate4 = '31.09.1750';
    let taskDate5 = '07.02.2050';
    let taskName1 = 'Task1#';
    let taskName2 = 'Task2';
    //let taskName3 = 'Task3';
    let taskName4 = 'Task4';
    let taskName5 = 'Task5';
    let taskBody1 = 'TaskBody1';
    let taskBody2 = 'TaskBody2';
    let taskBody3 = 'TaskBody3';
    //let taskBody4 = 'TaskBody4';
    let taskBody5 = 'TaskBody5';
    let taskTags1 = 'Tag1, Tag2, Tag3';
    let taskTags2 = 'Tag4, Tag5, Tag6';
    let taskTags3 = 'Tag7, Tag8, Tag9';
    let taskTags4 = 'Tag10-Tag11-Tag12';
    //let taskTags5 = 'Tag13, Tag14, Tag15';
    let formData1 = {
        dateInputValue: taskDate1,
        dateInputError: null,
        taskNameInputValue: taskName1,
        taskNameInputError: null,
        taskBodyInputValue: taskBody1,
        taskBodyInputError: null,
        taskTagsInputValue: taskTags1,
        taskTagsInputError: null,
      };
      let formData2 = {
        dateInputValue: '',
        dateInputError: null,
        taskNameInputValue: taskName2,
        taskNameInputError: null,
        taskBodyInputValue: taskBody2,
        taskBodyInputError: null,
        taskTagsInputValue: taskTags2,
        taskTagsInputError: null,
      };
      let formData3 = {
        dateInputValue: taskDate3,
        dateInputError: null,
        taskNameInputValue: '',
        taskNameInputError: null,
        taskBodyInputValue: taskBody3,
        taskBodyInputError: null,
        taskTagsInputValue: taskTags3,
        taskTagsInputError: null,
      };
      let formData4 = {
        dateInputValue: taskDate4,
        dateInputError: null,
        taskNameInputValue: taskName4,
        taskNameInputError: null,
        taskBodyInputValue: '',
        taskBodyInputError: null,
        taskTagsInputValue: taskTags4,
        taskTagsInputError: null,
      };
      let formData5 = {
        dateInputValue: taskDate5,
        dateInputError: null,
        taskNameInputValue: taskName5,
        taskNameInputError: null,
        taskBodyInputValue: taskBody5,
        taskBodyInputError: null,
        taskTagsInputValue: '',
        taskTagsInputError: null,
      };

      let validationData1 = {isValidated: false, 
              errorTexts: {
                dateErrorMessage: 'Please, enter date in "xx.xx.xxxx" format',
                taskNameErrorMessage: 'Task name must consist of letters, numbers and symbols -./\\?',
                taskBodyErrorMessage: null,
                taskTagsErrorMessage: null,
              },
            };
      let validationData2 = {isValidated: false, 
              errorTexts: {
                dateErrorMessage: 'Task date field must be filled',
                taskNameErrorMessage: null,
                taskBodyErrorMessage: null,
                taskTagsErrorMessage: null,
              },
            };
      let validationData3 = {isValidated: false, 
              errorTexts: {
                dateErrorMessage: 'Please, enter date in "xx.xx.xxxx" format',
                taskNameErrorMessage: 'Task name field must be filled',
                taskBodyErrorMessage: null,
                taskTagsErrorMessage: null,
              },
            };
      let validationData4 = {isValidated: false, 
              errorTexts: {
                dateErrorMessage: "Please, enter year between 2000 and 2050",
                taskNameErrorMessage: null,
                taskBodyErrorMessage: 'Task body field must be filled',
                taskTagsErrorMessage: 'Please, enter comma-saparated list of no more than 5 tags',
              },
            };
      let validationData5 = {isValidated: true, 
              errorTexts: {
                dateErrorMessage: null,
                taskNameErrorMessage: null,
                taskBodyErrorMessage: null,
                taskTagsErrorMessage: null,
              },
            };	

      expect(validateTaskData(formData1)).toEqual(validationData1);
      expect(validateTaskData(formData2)).toEqual(validationData2);
      expect(validateTaskData(formData3)).toEqual(validationData3);
      expect(validateTaskData(formData4)).toEqual(validationData4);
      expect(validateTaskData(formData5)).toEqual(validationData5);
  });
  it('check getActionDataObject', () => {
    let action1 = 'EDIT_TASK';
    let action2 = 'DELETE_TASK';
    let data1 = {userName: data[0].userName, taskObject: data[0].userTasks[0]};
    let data2 = {userName: data[1].userName, tasksArray: [data[1].userTasks[1]]};
    
    let output1 = {
      action: 'EDIT_TASK',
      data: {userName: "OliviaSmith", taskObject: {"taskID": 1, "taskDate": "2020-02-02T21:00:00.000Z", "taskName": "Smth1", "taskBody": "Do smth1","taskTags": "do,smth,task"}},
    };
    let output2 = {
      action: 'DELETE_TASK',
      data: {userName: "HenryOscar", tasksArray: [{"taskID": 2, "taskDate": "2020-10-31T21:00:00.000Z", "taskName": "Smth21", "taskBody": "Do smth21","taskTags": "do,task"}]},
    };
      
    expect(getActionDataObject(action1, data1)).toEqual(output1);
    expect(getActionDataObject(action2, data2)).toEqual(output2);
  });
});
describe('TaskComponent', () => {  
  let taskComponent;

  it('component task snapshot, edit task snapshot', () => {  
    let taskComponent = renderer.create(<TaskComponent task = {data[0].userTasks[0]} userName = {data[0].userName} needDate = {true}/>);
    let taskComponentTree = taskComponent.toJSON()
    expect(taskComponentTree).toMatchSnapshot();
    const editTask = taskComponent.root.find( el => el.type === 'input'&& el.props.value === 'Edit');
    editTask.props.onClick();
    taskComponentTree = taskComponent.toJSON()
    expect(taskComponentTree).toMatchSnapshot();
  });  
  beforeEach(()=> {
    taskComponent = mount(<TaskComponent task = {data[0].userTasks[0]} userName = {data[0].userName} needDate = {true}/>);
  })
  it('component exists, check props', () => {  
    expect(taskComponent).toBeTruthy();
    expect(taskComponent.props().task).toEqual(data[0].userTasks[0]);
    expect(taskComponent.props().userName).toEqual(data[0].userName);
    expect(taskComponent.props().needDate).toEqual(true);
  });
  it('check nodes inner texts from props', () => {  
    expect(taskComponent.find('.TaskDate').text()).toEqual(getDateString(new Date(data[0].userTasks[0].taskDate)));
    expect(taskComponent.find('.TaskName').text()).toEqual(data[0].userTasks[0].taskName);
    expect(taskComponent.find('.TaskBody').text()).toEqual(data[0].userTasks[0].taskBody);
    expect(taskComponent.find('.TaskTags').text()).toEqual(data[0].userTasks[0].taskTags.split(',').join(''));
  
  });
  it('simulate "Delete" click', () => {
    let handleDeleteClick = jest.fn();
    let deleteInput = taskComponent.find('input').at(0);  
    deleteInput.props().onClick = handleDeleteClick;  
    deleteInput.props().onClick();
    expect(handleDeleteClick).toHaveBeenCalledTimes(1);  
  });
  it('simulate "Edit" click, check nodes values, change node, simulate "Edit task" click, simulate "Cancel" click', () => {    
    taskComponent.find('input').at(1).simulate('click'); 

    expect(taskComponent.find('input').at(0).props().value).toEqual(getDateString(new Date(data[0].userTasks[0].taskDate)));
    expect(taskComponent.find('input').at(1).props().value).toEqual(data[0].userTasks[0].taskName);
    expect(taskComponent.find('textarea').at(0).props().value).toEqual(data[0].userTasks[0].taskBody);
    expect(taskComponent.find('input').at(2).props().value).toEqual(data[0].userTasks[0].taskTags);

    taskComponent.find('input').at(1).props().value = 'x'; 
    expect(taskComponent.find('input').at(1).props().value).toEqual('x'); 

    let handleEditTaskClick = jest.fn();
    let editTaskInput = taskComponent.find('input').at(3);
    editTaskInput.props().onClick = handleEditTaskClick;
    editTaskInput.props().onClick();
    expect(handleEditTaskClick).toHaveBeenCalledTimes(1);

    let handleCancelClick = jest.fn();
    let cancelTaskInput = taskComponent.find('input').at(4);
    cancelTaskInput.props().onClick = handleCancelClick;
    cancelTaskInput.props().onClick();
    expect(handleCancelClick).toHaveBeenCalledTimes(1);
  });
});
describe('TaskComponent actionCreators', () => {    
  it('check deleteTaskAC', () => {  
    expect(deleteTaskAC(data)).toEqual({type: DELETE_TASK, usersData: data});
  }); 
  it('check editTaskAC', () => {  
    expect(editTaskAC(data)).toEqual({type: EDIT_TASK, usersData: data});
  });  
});
describe('TaskComponent reducer', () => {    
  it('check reducer on delete task', () => {
    let data1 = [data[0]];
    let data2 = [JSON.parse(JSON.stringify(data[0]))];
    const state = {
      users: data,//массив хэшей-данных о users
      mode: 1,//1 - загрузка, 2 - ошибка, 3 - данные получены
      isLoggedIn: {userName: null, userPassword: null},//логин, пароль пользователя или null, null
      lastVisitedUrl: '/',
    };
    expect(taskManagerUsersDataReducer(state, {type: DELETE_TASK, usersData: data1})).toEqual({...state, users: data2});
  }); 
  it('check reducer on edit task', () => {
    let data1 = [data[0]];
    let data2 = [JSON.parse(JSON.stringify(data[0]))];
    const state = {
      users: data,//массив хэшей-данных о users
      mode: 1,//1 - загрузка, 2 - ошибка, 3 - данные получены
      isLoggedIn: {userName: null, userPassword: null},//логин, пароль пользователя или null, null
      lastVisitedUrl: '/',
    };
    expect(taskManagerUsersDataReducer(state, {type: EDIT_TASK, usersData: data1})).toEqual({...state, users: data2});
  });    
});
describe('LogInView functions', () => {
    it('check validateLogInData', () => {  
      let userName1 = 'OliviaSmith1';
      let userName2 = 'HenryOscar';
      let userPsw1 = 'something';
      let userPsw2 = 'somethingelse';
      let userPsw3 = 'somethingelse1';
      let output1 = {isValidated: false, 
                    nameInputError: 'There is no User with this name', 
                    pswInputError: 'Password is invalid, please, try one more time',
                  };
      let output2 = {isValidated: false, 
                    nameInputError: 'User Name field must be filled', 
                    pswInputError: 'Password is invalid, please, try one more time',
                  };
      let output3 = {isValidated: false, 
                    nameInputError: null, 
                    pswInputError: 'Password is invalid, please, try one more time',
                  };
      let output4 = {isValidated: false, 
                    nameInputError: null, 
                    pswInputError: 'Password field must be filled'
                  };
      let output5 = {isValidated: true, 
                    nameInputError: null, 
                    pswInputError: null
                  };
      
      expect(validateLogInData(data, userName1, userPsw1)).toEqual(output1);
      expect(validateLogInData(data, '', userPsw1)).toEqual(output2);
      expect(validateLogInData(data, userName2, userPsw3)).toEqual(output3);
      expect(validateLogInData(data, userName2, '')).toEqual(output4);
      expect(validateLogInData(data, userName2, userPsw2)).toEqual(output5);
  });
});
describe('LogInView + redux', () => {
  const mockStore = configureStore();
  const initialState = {
    taskManagerUsersData: {
      users: [...data],
      isLoggedIn: {userName: data[0].userName, userPassword: data[0].userPassword},
      lastVisitedUrl: '/',
    }
  };
  let store;
  let connectedLogInView;  
  it('render the connected component, snapshot', () => {
    connectedLogInView = renderer.create(<Provider store = {store}><ConnectedLogInView/></Provider>).toJSON();
    expect(connectedLogInView).toMatchSnapshot();
  });
  beforeEach(()=> {
    store = mockStore(initialState);
    connectedLogInView = mount(<Provider store = {store}><ConnectedLogInView/></Provider>);
  });
  it('check props match with mock redux state', () => {
    expect(connectedLogInView.find(LogInView).props().users).toEqual(initialState.taskManagerUsersData.users);
    expect(connectedLogInView.find(LogInView).props().isLoggedIn).toEqual(initialState.taskManagerUsersData.isLoggedIn);
    expect(connectedLogInView.find(LogInView).props().lastVisitedUrl).toEqual(initialState.taskManagerUsersData.lastVisitedUrl);
  });
  it('simulate "Log in" click', () => {     
    let handleLogInClick = jest.fn();
    let logInInput = connectedLogInView.find(LogInView).find('input').at(2);  
    logInInput.props().onClick = handleLogInClick;  
    logInInput.props().onClick();
    expect(handleLogInClick).toHaveBeenCalledTimes(1);      
  });
  it('simulate "Cancel" click', () => {     
    let handleCancelClick = jest.fn();
    let logInInput = connectedLogInView.find(LogInView).find('input').at(3);  
    logInInput.props().onClick = handleCancelClick;  
    logInInput.props().onClick();
    expect(handleCancelClick).toHaveBeenCalledTimes(1);      
  });
});
describe('LogInView actionCreators', () => {    
  it('check switchUserStatusAC', () => {  
    expect(switchUserStatusAC(data[0].userName, data[0].userPassword)).toEqual({type: SWITCH_USER_STATUS, userStatus: {userName: data[0].userName, userPassword: data[0].userPassword}});
  }); 
});
describe('LogInView reducer', () => {    
  it('check reducer on switch user status', () => {
    const state = {
      users: data,//массив хэшей-данных о users
      mode: 1,//1 - загрузка, 2 - ошибка, 3 - данные получены
      isLoggedIn: {userName: null, userPassword: null},//логин, пароль пользователя или null, null
      lastVisitedUrl: '/',
    };
    expect(taskManagerUsersDataReducer(state, {type: SWITCH_USER_STATUS, userStatus: {userName: 'Henry', userPassword: 'xxx'}})).toEqual({...state, isLoggedIn: {userName: 'Henry', userPassword: 'xxx'}});
  });  
});
