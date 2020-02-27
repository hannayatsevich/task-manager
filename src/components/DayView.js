import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import MonthComponent from './MonthComponent';
import {YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END, MONTH_NAMES, 
  getJSXFromArray, getYearsAvailiableJSX, getChosenDayTasksArray} from './_functionsAndConstants';
import {rememberLastUrlAC} from '../redux/actionCreators';
import TaskComponent from './TaskComponent';
import NotAllowedView from './NotAllowedView';
import '../styles/DayView.css';

class DayView extends React.PureComponent{
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,//redux - state.taskManagerUsersData.users
    isLoggedIn: PropTypes.string,//redux - state.taskManagerUsersData.isLoggedIn.userName
  };
  constructor(props) {
    super(props);;
    
    this.selectYearRef = React.createRef();
    this.selectMonthRef = React.createRef();
    
    this.state = {      
      yearNum: parseInt(props.match.params.yearNum),//из параметров ссылки
      monthNum: parseInt(props.match.params.monthNum) - 1,//из параметров ссылки, в параметре реальный номер, здесь как он определяется в формате Data JS
      chosenDay: parseInt(props.match.params.chosenDay),//из параметров ссылки
      yearsAvailiableJSX: getYearsAvailiableJSX(YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END),
      monthJSX: getJSXFromArray(MONTH_NAMES),
      monthNames: MONTH_NAMES,
      chosenDayTasksArray: getChosenDayTasksArray(props.isLoggedIn, props.users, parseInt(props.match.params.yearNum), parseInt(props.match.params.monthNum) - 1, parseInt(props.match.params.chosenDay)),
    };

    
  };
  setYear = () => {
    let yearNum = parseInt(this.selectYearRef.current.value);
    this.setState({yearNum: yearNum});
  };
  setMonth = () => {
    let monthNum = this.state.monthNames.indexOf(this.selectMonthRef.current.value);
    this.setState({monthNum: monthNum});
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    let chosenDayTasksArray = getChosenDayTasksArray(nextProps.isLoggedIn, nextProps.users, parseInt(nextProps.match.params.yearNum), parseInt(nextProps.match.params.monthNum) - 1, parseInt(nextProps.match.params.chosenDay));
    if(this.state.yearNum !== parseInt(nextProps.match.params.yearNum) || this.state.monthNum !== parseInt(nextProps.match.params.monthNum) - 1 || this.state.chosenDay !== parseInt(nextProps.match.params.chosenDay))
      this.setState({yearNum: parseInt(nextProps.match.params.yearNum), 
                    monthNum: parseInt(nextProps.match.params.monthNum) - 1, 
                    chosenDay: parseInt(nextProps.match.params.chosenDay), 
                    chosenDayTasksArray: chosenDayTasksArray});
    else  
      this.setState({chosenDayTasksArray: chosenDayTasksArray});
  };
  componentDidMount() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  componentDidUpdate() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  render() {
    if(!this.props.isLoggedIn) {
      //console.log('DayView render NotAllowed');
      return NotAllowedView('DayViewNotAllowed');
    }      
    else if(this.state.yearNum !== parseInt(this.props.match.params.yearNum) || this.state.monthNum !== parseInt(this.props.match.params.monthNum) - 1 || this.state.chosenDay !== parseInt(this.props.match.params.chosenDay)) {
      //console.log('DayView render redirect');
      return <Redirect to = {`/day/${this.state.yearNum}/${this.state.monthNum + 1}/${this.state.chosenDay}`}/>;
    }
    else {
      //.log('DayView render');
      return (
        <div className = 'DayView'>
          <div className = 'DayViewMonth'>
            <p>
              <span>Choose year </span>
              <select ref = {this.selectYearRef} onChange = {this.setYear} value = {this.state.yearNum}>{this.state.yearsAvailiableJSX}</select>
            </p>
            <p>
              <span>Choose month </span>
              <select ref = {this.selectMonthRef} onChange = {this.setMonth} value = {this.state.monthNames[this.state.monthNum]}>{this.state.monthJSX}</select>
            </p>
            <MonthComponent
              yearNum = {this.state.yearNum}
              monthNum = {this.state.monthNum}
              chosenDay = {this.state.chosenDay}
              needMonthLink = {false}
            />
          </div>
          <div className = 'DayViewTasks'>
            <div>
              {this.state.chosenDayTasksArray.map(element => <TaskComponent key = {element.taskID} task = {element} needDate = {true} userName = {this.props.isLoggedIn}/>)}
            </div>
          </div>
        </div>
        );
    };
  };
};
const mapStateToProps = function (state) {
  return {
    users: state.taskManagerUsersData.users,
    isLoggedIn: state.taskManagerUsersData.isLoggedIn.userName,
 };
};
export default connect(mapStateToProps)(DayView);

