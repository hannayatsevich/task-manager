import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {MONTH_NAMES, getMonthData, getMonthTasksDaysArray, getTrJSXArray} from './_functionsAndConstants';
import '../styles/MonthComponent.css';

class MonthComponent extends React.PureComponent{
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,//redux - state.taskManagerUsersData.users
    isLoggedIn: PropTypes.string,//redux - state.taskManagerUsersData.isLoggedIn.userName
    yearNum: PropTypes.number.isRequired,
    monthNum: PropTypes.number.isRequired,
    chosenDay: PropTypes.number.isRequired,
    needMonthLink: PropTypes.bool.isRequired,
  };
  constructor(props){
    super(props);
    
    let monthData = getMonthData(this.props.yearNum, this.props.monthNum, this.props.chosenDay);
    let monthTasksDaysArray = getMonthTasksDaysArray(props.users, props.isLoggedIn, monthData);
    let trJSXArray = getTrJSXArray (monthData, monthTasksDaysArray);

    this.state = {
      monthNames: MONTH_NAMES,
      monthData: monthData,//хэш с ключами yearNum, monthNum, chosenDayNum, inputDateLastDay, firstWeekdayNum, lastWeekdayNum
      monthTasksDaysArray: monthTasksDaysArray,//массив номеров дней с какими-л задачами
      trJSXArray: trJSXArray,//массив строк таблицы с днями
    };
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    let monthData = getMonthData(nextProps.yearNum, nextProps.monthNum, nextProps.chosenDay);
    let monthTasksDaysArray = getMonthTasksDaysArray(nextProps.users, nextProps.isLoggedIn, monthData);
    let trJSXArray = getTrJSXArray (monthData, monthTasksDaysArray);
    this.setState({monthData: monthData, monthTasksDaysArray: monthTasksDaysArray, trJSXArray: trJSXArray});
  };
  render(){
    //console.log('MonthComponent render');
    return (
      <div className = 'MonthComponent'>
        <p className = 'MonthName'>
          {this.props.needMonthLink
          ? <Link to = {`/month/${this.state.monthData.yearNum}/${this.state.monthData.monthNum + 1}`}>{this.state.monthNames[this.state.monthData.monthNum]}</Link>
          : this.state.monthNames[this.state.monthData.monthNum]
          }
        </p>
        <table className = 'CalendarTable'>
          <thead className = 'TableHeader'>
            <tr><td></td><td>Mo</td><td>Tu</td><td>We</td><td>Th</td><td>Fr</td><td>Sa</td><td>Su</td></tr>
          </thead>
          <tbody>
            {this.state.trJSXArray.map((element, index) => <tr key = {index}>{element}</tr>)}
          </tbody>
        </table>
      </div>
    );
  };
};
const mapStateToProps = function (state) {
  return {
    users: state.taskManagerUsersData.users,
    isLoggedIn: state.taskManagerUsersData.isLoggedIn.userName,
 };
};

export default connect(mapStateToProps)(MonthComponent);