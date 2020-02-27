import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import TaskComponent from './TaskComponent';
import NotAllowedView from './NotAllowedView';
import {MONTH_NAMES, SHOW_BY, DEF_MONTH_VALUE, DEF_DAY_VALUE, DEF_YEAR_VALUE, 
  YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END,
  findUser, escapeHTML,
  getTasksForPages, getUserLoggedInTasksArrayJSX, 
  getLinksForTasksPagesArray, getYearsAvailiableJSX, 
  getJSXFromArray, getDaysJSX, getFilteredByDateTasks,
  getFilteredByTextTasks, getActionDataObject, getSortedTasks,
  } from './_functionsAndConstants';
import {DELETE_TASK, getUsersDataThunkForActionAC, rememberLastUrlAC} from '../redux/actionCreators';
import '../styles/AllTasksView.css';

class AllTasksView extends React.Component{
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,//redux - state.taskManagerUsersData.users
    isLoggedIn: PropTypes.string,//redux - state.taskManagerUsersData.isLoggedIn.userName
  };
  constructor(props) {
    super(props);

    let viewControlData = {
      showFromTodayDate: false,//отображать задачи не ранее сегодняшнего дня
      sortByDate: false,
      sortByTaskName: false,
      showByValue: SHOW_BY[0],
      yearValue: DEF_YEAR_VALUE,
      monthValue: DEF_MONTH_VALUE,
      dayValue: DEF_DAY_VALUE,
      searchTaskNameValue: '',
      searchTaskBodyValue: '',
      searchTagValue: '',
    };

    let userLoggedInData = findUser(props.users, props.isLoggedIn);
    let userLoggedInTasks = [];
    if(userLoggedInData)
      userLoggedInTasks = userLoggedInData.userTasks;
    let userFilteredAndSortedTasks = [];
    if(userLoggedInTasks.length !== 0) {
      let userFilteredByDateTasks = getFilteredByDateTasks(userLoggedInTasks, viewControlData);//по дате
      let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, viewControlData);//по тексту
      userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, viewControlData);//сортировка
    }
    let tasksForPages = getTasksForPages(SHOW_BY[0], userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages//был li arr

    this.checkShowFromTodayDateRef = React.createRef();
    this.checkSortByDateRef = React.createRef();
    this.checkSortByTaskNameRef = React.createRef();
    this.selectshowByRef = React.createRef();
    this.selectYearRef = React.createRef();
    this.selectMonthRef = React.createRef();
    this.selectDayRef = React.createRef();
    this.searchTaskNameRef = React.createRef();
    this.searchTaskBodyRef = React.createRef();
    this.searchTagRef = React.createRef();

    this.state = {
      yearsAvailiableJSX: getYearsAvailiableJSX(YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END, DEF_YEAR_VALUE),//options заданного диапазона лет
      monthJSX: getJSXFromArray(MONTH_NAMES, DEF_MONTH_VALUE),//options месяцев
      monthNames: MONTH_NAMES,//массив с названиями месяцев
      //менять в зависимости от выбранного месяца
      daysJSX: getDaysJSX(31, DEF_DAY_VALUE),//options дней выбранного месяца
      showByJSX: getJSXFromArray(SHOW_BY),
      userLoggedInTasks: userLoggedInTasks,//массив задач залогиненного пользователя
      userFilteredAndSortedTasks: userFilteredAndSortedTasks,//отфильтрованный и отсортированный массив задач залогиненного пользователя
      pageNum: parseInt(props.match.params.page),//текущая траница(роут)
      numOfPages: tasksForPages.numOfPages,//количество страниц отфильтрованных задач
      tasksOnPages: tasksForPages.tasksOnPages,//хэш отфильтрованных задач по страницам     
      viewControlData: viewControlData,
    };
  };

  setShowFromTodayDate = () => {
    let showFromTodayDate = this.checkShowFromTodayDateRef.current.checked;
    console.log(showFromTodayDate);
    let newViewControlData = {...this.state.viewControlData, showFromTodayDate: showFromTodayDate};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(newViewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});

  };
  setSortByDate = () => {
    let sortByDate = this.checkSortByDateRef.current.checked;
    let sortByTaskName = this.state.viewControlData.sortByTaskName;
    if(sortByTaskName && sortByDate)
      sortByTaskName = !sortByDate;
    let newViewControlData = {...this.state.viewControlData, sortByDate: sortByDate, sortByTaskName: sortByTaskName};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(newViewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});

  };
  setSortByTaskName = () => {
    let sortByTaskName = this.checkSortByTaskNameRef.current.checked;
    let sortByDate = this.state.viewControlData.sortByDate;
    if(sortByDate && sortByTaskName)
      sortByDate = !sortByTaskName;
    let newViewControlData = {...this.state.viewControlData, sortByDate: sortByDate, sortByTaskName: sortByTaskName};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(newViewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});

  };
  setShowBy = () => {
    let showByValue = parseInt(this.selectshowByRef.current.value);
    let newViewControlData = {...this.state.viewControlData, showByValue: showByValue};
    let tasksForPages = getTasksForPages(showByValue, this.state.userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages})
  };
  setYear = () => {
    let yearValue = this.selectYearRef.current.value;
    if(yearValue !== DEF_YEAR_VALUE)
     yearValue = parseInt(this.selectYearRef.current.value);
    let newViewControlData = {...this.state.viewControlData, yearValue: yearValue};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});
  };
  setMonth = () => {
    let monthValue = this.selectMonthRef.current.value;
    let lastDayOfMonth = 31;
    if(monthValue !== DEF_MONTH_VALUE) {
      monthValue = this.state.monthNames.indexOf(this.selectMonthRef.current.value);
      lastDayOfMonth = (new Date((new Date()).getFullYear(), monthValue + 1, 0)).getDate();
    }
    let newViewControlData = {...this.state.viewControlData, monthValue: monthValue};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages    
    let daysJSX = getDaysJSX(lastDayOfMonth, 'All Days');
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages,
                  daysJSX: daysJSX});
  };
  setDay = () => {;
    let dayValue = this.selectDayRef.current.value;
    if(dayValue !== DEF_DAY_VALUE)
      dayValue = parseInt(this.selectDayRef.current.value);
    let newViewControlData = {...this.state.viewControlData, dayValue: dayValue};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});

  };
  searchTaskName = () => {
    let searchTaskNameValue = escapeHTML(this.searchTaskNameRef.current.value);
    let newViewControlData = {...this.state.viewControlData, searchTaskNameValue: searchTaskNameValue};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});
  };
  searchTaskBody = () => {
    let searchTaskBodyValue = escapeHTML(this.searchTaskBodyRef.current.value);
    let newViewControlData = {...this.state.viewControlData, searchTaskBodyValue: searchTaskBodyValue};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});
  };
  searchTag = () => {
    let searchTagValue = escapeHTML(this.searchTagRef.current.value);
    let newViewControlData = {...this.state.viewControlData, searchTagValue: searchTagValue};
    let userFilteredByDateTasks = getFilteredByDateTasks(this.state.userLoggedInTasks, newViewControlData);//по дате
    let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, newViewControlData);//по тексту
    let userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, newViewControlData);
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    this.setState({viewControlData: newViewControlData, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks, 
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages});
  };
  deleteAllUserTasks = () => {
    let actionDataObject = getActionDataObject(DELETE_TASK, {userName: this.props.isLoggedIn, tasksArray: this.state.userLoggedInTasks});
    this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
  };
  deleteFilteredUserTasks = () => {
    let actionDataObject = getActionDataObject(DELETE_TASK, {userName: this.props.isLoggedIn, tasksArray: this.state.userFilteredAndSortedTasks});
    this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    let pageNum = parseInt(nextProps.match.params.page);
    let userLoggedInData = findUser(nextProps.users, nextProps.isLoggedIn);
    let userLoggedInTasks = [];
    if(userLoggedInData)
      userLoggedInTasks = userLoggedInData.userTasks;
    let userFilteredAndSortedTasks = [];
    if(userLoggedInTasks.length !== 0) {
      let userFilteredByDateTasks = getFilteredByDateTasks(userLoggedInTasks, this.state.viewControlData);//по дате
      let userFilteredTasks = getFilteredByTextTasks(userFilteredByDateTasks, this.state.viewControlData);//по тексту
      userFilteredAndSortedTasks = getSortedTasks(userFilteredTasks, this.state.viewControlData);
    }
    let tasksForPages = getTasksForPages(this.state.viewControlData.showByValue, userFilteredAndSortedTasks);//хэш с ключами numOfPages, tasksOnPages
    
    this.setState({userLoggedInTasks: userLoggedInTasks, 
                  pageNum: pageNum,
                  numOfPages: tasksForPages.numOfPages, 
                  tasksOnPages: tasksForPages.tasksOnPages, 
                  userFilteredAndSortedTasks: userFilteredAndSortedTasks}); 
  };
  componentDidMount() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  componentDidUpdate() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  render() {
    if(!this.props.isLoggedIn) {
      //console.log('AllTasksView render NotAllowed');
      return NotAllowedView('AllTasksViewNotAllowed');
    }
    else {
      return (
        <div className = 'AllTasksView'>
          <div className = 'ControlData'>
            <p>
              <input type = 'checkbox' checked = {this.state.viewControlData.showFromTodayDate} ref = {this.checkShowFromTodayDateRef} onChange = {this.setShowFromTodayDate}/>
              <span>Show from today date</span>
            </p>
            <p>
              <input type = 'checkbox' checked = {this.state.viewControlData.sortByDate} ref = {this.checkSortByDateRef} onChange = {this.setSortByDate}/>
              <span>Sort by date</span>
            </p>
            <p>
              <input type = 'checkbox' checked = {this.state.viewControlData.sortByTaskName} ref = {this.checkSortByTaskNameRef} onChange = {this.setSortByTaskName}/>
              <span>Sort by task name</span>
            </p>
            <p>
              <span>Show tasks by </span>
              <select ref = {this.selectshowByRef} onChange = {this.setShowBy} value = {this.state.viewControlData.showByValue}>{this.state.showByJSX}</select>
            </p>
            <p>
              <span>Choose year </span>
              <select ref = {this.selectYearRef} onChange = {this.setYear} value = {this.state.viewControlData.yearValue}>{this.state.yearsAvailiableJSX}</select>
            </p>
            <p>
              <span>Choose month </span>
              <select ref = {this.selectMonthRef} onChange = {this.setMonth} 
                      value = {this.state.monthNames[this.state.viewControlData.monthValue] !== -1 ? this.state.monthNames[this.state.viewControlData.monthValue] : this.state.viewControlData.monthValue}>{this.state.monthJSX}</select>
            </p>
            <p>
              <span>Choose day </span>
              <select ref = {this.selectDayRef} onChange = {this.setDay} value = {this.state.viewControlData.dayValue}>{this.state.daysJSX}</select>
            </p>
            <p>
              <span>Search in task names </span>
              <input type = 'text' ref = {this.searchTaskNameRef} onChange = {this.searchTaskName} value = {this.state.viewControlData.searchTaskNameValue}></input>
            </p>
            <p>
              <span>Search in task bodies </span>
              <input type = 'text' ref = {this.searchTaskBodyRef} onChange = {this.searchTaskBody} value = {this.state.viewControlData.searchTaskBodyValue}></input>
            </p>
            <p>
              <span>Search in tags </span>
              <input type = 'text' ref = {this.searchTagRef} onChange = {this.searchTag} value = {this.state.viewControlData.searchTagValue}></input>
            </p>
            <p>
              <input type = 'button' value = 'Delete all tasks' onClick = {this.deleteAllUserTasks}></input>
              <input type = 'button' value = 'Delete filtered tasks' onClick = {this.deleteFilteredUserTasks}></input>
            </p>

          </div>
          
          <div className = 'ResultData'>
            <div className = 'PageLinks'>
              {this.state.numOfPages > 0 && <span>Pages: </span>}
              {this.state.numOfPages > 0 && getLinksForTasksPagesArray(this.state.numOfPages)}
            </div>
            { this.state.numOfPages > 0
            ? (this.state.pageNum <= this.state.numOfPages ? getUserLoggedInTasksArrayJSX(this.state.tasksOnPages[this.state.pageNum], TaskComponent, this.props.isLoggedIn) : <Redirect to = {`/alltasks/${this.state.numOfPages}`}/>)
            : ''}
            <div className = 'PageLinks'>
              {this.state.numOfPages > 0 && <span>Pages: </span>}
              {this.state.numOfPages > 0 && getLinksForTasksPagesArray(this.state.numOfPages)}
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
export {AllTasksView}
export default connect(mapStateToProps)(AllTasksView);