import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getActionDataObject} from './_functionsAndConstants';
import {DELETE_TASK, getUsersDataThunkForActionAC} from '../redux/actionCreators';
import '../styles/DayTasksComponent.css';

class DayTasksComponent extends React.Component{
  static propTypes = {
    taskDate: PropTypes.string.isRequired,
    tasks:PropTypes.arrayOf(
      PropTypes.shape({
        taskID: PropTypes.number.isRequired,
        taskDate: PropTypes.string.isRequired,
        taskName: PropTypes.string.isRequired,
        taskBody: PropTypes.string.isRequired,
        taskTags: PropTypes.string,
      }).isRequired,
    ).isRequired,
    userName: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    let taskNamesArrayJSX = props.tasks.map(element => {
      return <p key = {element.taskID}>{element.taskName}</p>
    });

    this.state = { 
      taskNamesArrayJSX: taskNamesArrayJSX,
      isAnimated: false,
    };
  };

  animateTasks = () => {
    this.setState({isAnimated: true});
  };
  deleteTasks = () => {
    let actionDataObject = getActionDataObject(DELETE_TASK, {userName: this.props.userName, tasksArray: [...this.props.tasks]});
    this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    let taskNamesArrayJSX = nextProps.tasks.map(element => {
      return <p key = {element.taskID}>{element.taskName}</p>
    });
    this.setState({taskNamesArrayJSX: taskNamesArrayJSX});
  };
  componentDidUpdate() {
    if(this.state.isAnimated) 
      setTimeout(this.deleteTasks, 800)
  };
  render() {
    //console.log('DayTaskComponent render')
    return (
      <div className = 'DayTasksComponent' id = {this.state.isAnimated ? 'DayTasksComponentAnimate' : undefined}>
        <div className = 'TasksDate'>{this.props.taskDate}</div>
        <div>{this.state.taskNamesArrayJSX}</div>
        <p className = 'TaskBtns'>
          <input type = 'button' value = 'Delete all' onClick = {this.animateTasks}></input>
        </p>
      </div>
    );
  }; 
};

export default connect()(DayTasksComponent);