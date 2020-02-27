import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getDateString, getActionDataObject, escapeHTML, validateTaskData, getDateFromString, getInitialFormData} from './_functionsAndConstants';
import {DELETE_TASK, EDIT_TASK, getUsersDataThunkForActionAC} from '../redux/actionCreators';
import '../styles/TaskComponent.css';

class TaskComponent extends React.Component{
  static propTypes = {
    task:PropTypes.shape({
      taskID: PropTypes.number.isRequired,
      taskDate: PropTypes.string.isRequired,
      taskName: PropTypes.string.isRequired,
      taskBody: PropTypes.string.isRequired,
      taskTags: PropTypes.string,
    }).isRequired,
    needDate: PropTypes.bool.isRequired,//для DayView false, для AllTasksView true
    userName: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    let taskDate = getDateString(new Date(props.task.taskDate));
    
    this.taskDateRef = React.createRef();
    this.taskNameRef = React.createRef();
    this.taskBodyRef = React.createRef();
    this.taskTagsRef = React.createRef();

    this.state = {    
      taskDate: taskDate,  
      tagsArray: props.task.taskTags.split(','),
      isEditable: false,     
      isAnimated: false,
      isValidated: true,
      formData: getInitialFormData(taskDate, props.task.taskName, props.task.taskBody, props.task.taskTags),
    };
  };

  animateTask = () => {
    this.setState({isAnimated: true});
  };
  deleteTask = () => {
    let actionDataObject = getActionDataObject(DELETE_TASK, {userName: this.props.userName, tasksArray: [this.props.task]});
    this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
  };
  setIsEditable = () => {
    this.setState({isEditable: true});
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
  editTask = () => {
    let taskDate = getDateFromString(this.state.formData.dateInputValue);
    if ( this.props.task.taskDate !== taskDate 
      || this.props.task.taskName !== this.state.formData.taskBodyInputValue 
      || this.props.task.taskBody !== this.state.formData.taskBodyInputValue 
      || this.props.task.taskTags !== this.state.formData.taskTagsInputValue) {
        let task = {...this.props.task, taskName: this.state.formData.taskNameInputValue, taskBody: this.state.formData.taskBodyInputValue, taskTags: this.state.formData.taskTagsInputValue, taskDate: taskDate};
        let actionDataObject = getActionDataObject(EDIT_TASK, {userName: this.props.userName, taskObject: task});
        this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
        this.setState({isEditable: false});
    }
    else
      this.canceEditingTask();
  };
  canceEditingTask = () => {
    let taskDate = getDateString(new Date(this.props.task.taskDate));
    let formData = getInitialFormData(taskDate, this.props.task.taskName, this.props.task.taskBody, this.props.task.taskTags);
    this.setState({isEditable: false, formData: formData});
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    let taskDate = getDateString(new Date(nextProps.task.taskDate));
    let tagsArray = nextProps.task.taskTags.split(',');
    let formData = getInitialFormData(taskDate, nextProps.task.taskName, nextProps.task.taskBody, nextProps.task.taskTags);
    this.setState({taskDate: taskDate, tagsArray: tagsArray, formData: formData});
  };
  componentDidUpdate() {
    if(this.state.isAnimated)
      setTimeout(this.deleteTask, 800)
  };
  render() {
    //console.log('TaskComponent render');
    if (this.state.isEditable)
      return (
        <div className = 'EditTaskWindow'>
          <p><label>Task date: <input type = 'text' ref = {this.taskDateRef} value = {this.state.formData.dateInputValue} onChange = {this.validateInputs}/></label></p>
          <p className = 'ErrorMsg'>{this.state.formData.dateInputError && <span>{this.state.formData.dateInputError}</span>}</p>
          <p><label>Task name: <input type = 'text' ref = {this.taskNameRef} value = {this.state.formData.taskNameInputValue} onChange = {this.validateInputs}/></label></p>
          <p className = 'ErrorMsg'>{this.state.formData.taskNameInputError && <span>{this.state.formData.taskNameInputError}</span>}</p>
          <p><label>Task body: <textarea ref = {this.taskBodyRef} value = {this.state.formData.taskBodyInputValue} onChange = {this.validateInputs}/></label></p>
          <p className = 'ErrorMsg'>{this.state.formData.taskBodyInputError && <span>{this.state.formData.taskBodyInputError}</span>}</p>
          <p><label>Task tags: <input type = 'text' ref = {this.taskTagsRef} value = {this.state.formData.taskTagsInputValue} onChange = {this.validateInputs}/></label></p>
          <p className = 'ErrorMsg'>{this.state.formData.taskTagsInputError && <span>{this.state.formData.taskTagsInputError}</span>}</p>
          <p>
            <input type = 'button' value = 'Edit task' disabled = {!this.state.isValidated} onClick = {this.editTask}/>
            <input type = 'button' value = 'Cancel' onClick = {this.canceEditingTask}/>
          </p>

        </div>
      );
    else 
      return (
        <div className = 'TaskComponent' id = {this.state.isAnimated ? 'TaskComponentAnimate' : undefined}>
          {this.props.needDate && <p className = 'TaskDate'>{getDateString(new Date(this.props.task.taskDate))}</p>}
          <p className = 'TaskName'>{this.props.task.taskName}</p>
          <p className = 'TaskBody'>{this.props.task.taskBody}</p>
          <p className = 'TaskTags'>{this.state.tagsArray && this.state.tagsArray.map((element, index) => <span className = 'TaskTag' key = {index}>{element}</span>)}</p>
          <p className = 'TaskBtns'>
            <input type = 'button' value = 'Delete' onClick = {this.animateTask}></input>
            <input type = 'button' value = 'Edit' onClick = {this.setIsEditable}></input>
          </p>
        </div>
    );
  };  
};
export {TaskComponent};
export default connect()(TaskComponent);