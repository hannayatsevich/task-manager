import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import NotAllowedView from './NotAllowedView';
import {getDateString, escapeHTML, validateTaskData, 
        getActionDataObject} from './_functionsAndConstants';
import {ADD_NEW_TASK, getUsersDataThunkForActionAC} from '../redux/actionCreators';

import '../styles/NewTaskPage.css';

class NewTaskPage extends React.PureComponent{
  static propTypes = {
    isLoggedIn: PropTypes.string,//redux - state.taskManagerUsersData.isLoggedIn.userName
    lastVisitedUrl: PropTypes.string.isRequired,//redux - state.taskManagerUsersData.lastVisitedUrl
  };
  constructor(props) {
    super(props);

    this.taskDateRef = React.createRef();
    this.taskNameRef = React.createRef();
    this.taskBodyRef = React.createRef();
    this.taskTagsRef = React.createRef();

    this.state = {
      formData: {
        dateInputValue: getDateString(new Date()),
        dateInputError: null,
        taskNameInputValue: '',
        taskNameInputError: null,
        taskBodyInputValue: '',
        taskBodyInputError: null,
        taskTagsInputValue: '',
        taskTagsInputError: null,
      },
      isValidated: false, 
      redirectToPrevUrl: false,
    };
  };

  validateInputs = () => {
    let taskDate = escapeHTML(this.taskDateRef.current.value);
    let taskName = escapeHTML(this.taskNameRef.current.value);
    let taskBody = escapeHTML(this.taskBodyRef.current.value);
    let taskTags = escapeHTML(this.taskTagsRef.current.value);
    let newFormData = {...this.state.formData, 
                      dateInputValue: taskDate, 
                      taskNameInputValue: taskName, 
                      taskBodyInputValue: taskBody, 
                      taskTagsInputValue: taskTags};
    let validationData = validateTaskData(newFormData);
    newFormData.dateInputError = validationData.errorTexts.dateErrorMessage;
    newFormData.taskNameInputError = validationData.errorTexts.taskNameErrorMessage;
    newFormData.taskBodyInputError = validationData.errorTexts.taskBodyErrorMessage;
    newFormData.taskTagsInputError = validationData.errorTexts.taskTagsErrorMessage;
    this.setState({isValidated: validationData.isValidated, formData: newFormData});
  };
  addNewTask = () => {    
    //let taskObject = getNewTaskObject(this.props.usersTasksInfo, this.props.isLoggedIn, this.state.formData);
    //let actionDataObject = getActionDataObject(ADD_NEW_TASK, {userName: this.props.isLoggedIn, tasksArray: [taskObject]});
    let actionDataObject = getActionDataObject(ADD_NEW_TASK, {userName: this.props.isLoggedIn, formData: this.state.formData});
    this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
    this.setState({redirectToPrevUrl: true});
  };
  cancelCreationNewTask = () => {
    this.setState({redirectToPrevUrl: true});
  };
  
  render() {
    if(!this.props.isLoggedIn) {
      //console.log('NewTaskPage render NotAllowed');
      return NotAllowedView('NewTaskPageNotAllowed');
    }
    if(this.state.redirectToPrevUrl) {
      //console.log('NewTaskPage render redirect');
      return <Redirect to = {this.props.lastVisitedUrl}/>;
    }
    else {
      //console.log('NewTaskPage render');
      return (
        <div className = 'NewTaskPage'>
          <div className = 'NewTaskWindow'>
            <p><label>Task date: <input type = 'text' ref = {this.taskDateRef} value = {this.state.formData.dateInputValue} onChange = {this.validateInputs}/></label></p>
            <p className = 'ErrorMsg'>{this.state.formData.dateInputError && <span>{this.state.formData.dateInputError}</span>}</p>
            <p><label>Task name: <input type = 'text' ref = {this.taskNameRef} value = {this.state.formData.taskNameInputValue} onChange = {this.validateInputs}/></label></p>
            <p className = 'ErrorMsg'>{this.state.formData.taskNameInputError && <span>{this.state.formData.taskNameInputError}</span>}</p>
            <p><label>Task body: <textarea ref = {this.taskBodyRef} value = {this.state.formData.taskBodyInputValue} onChange = {this.validateInputs}/></label></p>
            <p className = 'ErrorMsg'>{this.state.formData.taskBodyInputError && <span>{this.state.formData.taskBodyInputError}</span>}</p>
            <p><label>Task tags: <input type = 'text' ref = {this.taskTagsRef} value = {this.state.formData.taskTagsInputValue} onChange = {this.validateInputs}/></label></p>
            <p className = 'ErrorMsg'>{this.state.formData.taskTagsInputError && <span>{this.state.formData.taskTagsInputError}</span>}</p>
            <p>
              <input type = 'button' value = 'Add task' disabled = {!this.state.isValidated} onClick = {this.addNewTask}/>
              <input type = 'button' value = 'Cancel' onClick = {this.cancelCreationNewTask}/>
            </p>
          </div>
        </div>
      );
    };
  };
};

const mapStateToProps = function (state) {
  return {
    //usersTasksInfo: state.taskManagerUsersData.usersTasksInfo,
    isLoggedIn: state.taskManagerUsersData.isLoggedIn.userName,
    lastVisitedUrl: state.taskManagerUsersData.lastVisitedUrl,
 };
};

export default connect(mapStateToProps)(NewTaskPage);