import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import {YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END, MONTH_NAMES, 
        getJSXFromArray, getYearsAvailiableJSX, 
        getChosenMonthTasksMap, getChosenMonthTasksJSX,} from './_functionsAndConstants';
import {rememberLastUrlAC} from '../redux/actionCreators';
import MonthComponent from './MonthComponent';
import DayTasksComponent from './DayTasksComponent';
import NotAllowedView from './NotAllowedView';

import '../styles/MonthView.css';

class MonthView extends React.PureComponent{
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,//redux - state.taskManagerUsersData.users
    isLoggedIn: PropTypes.string,//redux - state.taskManagerUsersData.isLoggedIn.userName
  };
  constructor(props){
    super(props);
    
    let chosenMonthTasksMap = getChosenMonthTasksMap (props.isLoggedIn, props.users, parseInt(props.match.params.yearNum), parseInt(props.match.params.monthNum) - 1);
    let chosenMonthTasksJSX = getChosenMonthTasksJSX (props.isLoggedIn, chosenMonthTasksMap, DayTasksComponent);
        
    this.selectYearRef = React.createRef();
    this.selectMonthRef = React.createRef();
    
    this.state = {      
      yearNum: parseInt(props.match.params.yearNum),//из параметров ссылки, для сверки с props 
      monthNum: parseInt(props.match.params.monthNum) - 1,//из параметров ссылки, в параметре реальный номер, здесь как он определяется в формате Data JS
      yearsAvailiableJSX: getYearsAvailiableJSX(YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END),
      monthJSX: getJSXFromArray(MONTH_NAMES),
      monthNames: MONTH_NAMES,
      chosenMonthTasksMap: chosenMonthTasksMap,
      chosenMonthTasksJSX: chosenMonthTasksJSX,
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
    let chosenMonthTasksMap = getChosenMonthTasksMap (nextProps.isLoggedIn, nextProps.users, parseInt(nextProps.match.params.yearNum), parseInt(nextProps.match.params.monthNum) - 1);
    let chosenMonthTasksJSX = getChosenMonthTasksJSX (nextProps.isLoggedIn, chosenMonthTasksMap, DayTasksComponent);
    if(this.state.yearNum !== parseInt(nextProps.match.params.yearNum) || this.state.monthNum !== parseInt(nextProps.match.params.monthNum) - 1 || this.state.chosenDay !== parseInt(nextProps.match.params.chosenDay))
      this.setState({yearNum: parseInt(nextProps.match.params.yearNum), 
                    monthNum: parseInt(nextProps.match.params.monthNum) - 1, 
                    chosenMonthTasksMap: chosenMonthTasksMap, 
                    chosenMonthTasksJSX: chosenMonthTasksJSX});
    else  
      this.setState({chosenMonthTasksMap: chosenMonthTasksMap, 
                    chosenMonthTasksJSX: chosenMonthTasksJSX});
  };
  componentDidMount() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  componentDidUpdate() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  render() {
    if(!this.props.isLoggedIn) {
      //console.log('MonthView render NotAllowed');
      return NotAllowedView('MonthViewNotAllowed');
    }            
    else if(this.state.yearNum !== parseInt(this.props.match.params.yearNum) || this.state.monthNum !== parseInt(this.props.match.params.monthNum) - 1) {
      //console.log('MonthView redirect');
      return <Redirect to = {`/month/${this.state.yearNum}/${this.state.monthNum + 1}`}/>;
    }
    else {
      //console.log('MonthView render');
      return (
        <div className = 'MonthView'>
          <div className = 'MonthViewMonth'>
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
              chosenDay = {0}
              needMonthLink = {false}
            />
          </div>
          <div className = 'MonthViewTasks'>            
            {this.state.chosenMonthTasksJSX}            
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

export default connect(mapStateToProps)(MonthView);