import React from 'react';
import {Link, NavLink} from 'react-router-dom';

const LOCAL_STORAGE_STRING = 'TaskManagerUser';
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHOW_BY = [5, 10, 20, 50];
const DEF_YEAR_VALUE = 'All Years';
const DEF_MONTH_VALUE = 'All Months';
const DEF_DAY_VALUE = 'All Days';
const YEARS_AVAILIABLE_START = 2000;
const YEARS_AVAILIABLE_END = 2050;
const DATE_TODAY = 'DateToday';//имя класса
const DATE_WITH_TASK = 'DateWithTask';//имя класса
const DATE_CHOSEN = 'DateChosen';//имя класса
const WEEK_NUMBER = 'WeekNumber';//имя класса
const NEW_USER_DATA_TEMPLATE = {
  userName: '',//уникальное имя = id
  userPassword: '',
  userTasks: [],
};
const NEW_TASK_DATA_TEMPLATE = {
  taskID: 0,
  taskName: '',
  taskBody: '',
  taskTags: '',
};


function getNumbersFromDate(date) {
  let yearNum = date.getFullYear();
  let monthNum = date.getMonth() + 1;
  let dayNum = date.getDate();
  return {yearNum: yearNum, monthNum: monthNum, dayNum: dayNum};
};

function getNumberOfWeek(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  //return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
};
//возвращает хэш с ключами yearNum, monthNum, chosenDayNum, inputDateLastDay, firstWeekdayNum, lastWeekdayNum
function getMonthData(yearNum, monthNum, chosenDayNum) {
  let inputDateFirstDay = new Date(yearNum, monthNum, 1);
  let inputDateLastDay = new Date(yearNum, monthNum + 1, 0);
  let firstWeekdayNum = inputDateFirstDay.getDay();
  let lastWeekdayNum = inputDateLastDay.getDay();
  return {yearNum: yearNum, monthNum: monthNum, chosenDayNum: chosenDayNum, inputDateLastDay: getNumbersFromDate(inputDateLastDay).dayNum, firstWeekdayNum: firstWeekdayNum, lastWeekdayNum: lastWeekdayNum};
};

function getDoubleNumber(number) {
  if(number < 10) {
    number = '0' + number;
  };
  return number;
};

function getDateString(date) {
  let year = date.getFullYear();
  let month = getDoubleNumber(date.getMonth() + 1);
  let day = getDoubleNumber(date.getDate());
  return `${day}.${month}.${year}`;
};

function getDateFromString(dateString) {
  let dateNumbers = dateString.split('.');
  let date = new Date(dateNumbers[2], dateNumbers[1] - 1, dateNumbers[0]);
  return date;
};

function getMonthTasksDaysArray(store, userID, monthData) {  
  let userInfo = store.find(element => element.userName === userID);
  let monthTasksDaysArray = [];
  let monthTasksDaysSet = new Set();
  if(userInfo) {
    userInfo.userTasks.forEach(element => {
      if(typeof(element) === 'object' && element !== null) {
        if((new Date(element.taskDate)).getFullYear() === monthData.yearNum && (new Date(element.taskDate)).getMonth() === monthData.monthNum) {
          monthTasksDaysSet.add((new Date(element.taskDate)).getDate());
        };
      };    
    });
    monthTasksDaysArray = Array.from(monthTasksDaysSet);    
  };    
  return monthTasksDaysArray;
};

function getTrJSXArray(monthData, monthTasksDaysArray) {
  //monthData - хэш с ключами yearNum, monthNum, chosenDayNum, inputDateLastDay, firstWeekdayNum, lastWeekdayNum; 
  //monthTasksDaysSet - Set дней, в которые есть Task
  let currentDate = {yearNum: (new Date()).getFullYear(), monthNum: (new Date()).getMonth(), dayNum: (new Date()).getDate()};
  let tdArray = [];
  let trArray = [];
  let keyForRender = 0;
  //заполняем номер недели
  tdArray.push(<td className = {WEEK_NUMBER} key = {++keyForRender}>{getNumberOfWeek(new Date(monthData.yearNum, monthData.monthNum, 1))}</td>);
  //заполняем пустые клетки до первого дня месяца  
  if(monthData.firstWeekdayNum !== 0) {    
    for (let i = 1; i < monthData.firstWeekdayNum; i++) {
      tdArray.push(<td key = {++keyForRender}></td>)
    };  
  }
  else {
    for (let i = 1; i <= 6; i++) {
      tdArray.push(<td key = {++keyForRender}></td>);
    };
  };
  //заполняем клетки дней
  //номер месяца + 1
  for (let i = 1; i <= monthData.inputDateLastDay; i++) {
    let weekDayNum = (new Date(monthData.yearNum, monthData.monthNum, i)).getDay();    
    let classNameString = '';
    if(i === currentDate.dayNum && monthData.monthNum === currentDate.monthNum && monthData.yearNum === currentDate.yearNum)
      classNameString += ` ${DATE_TODAY}`;
    if(monthTasksDaysArray.indexOf(i) !== -1)
      classNameString += ` ${DATE_WITH_TASK}`;
    if(i === monthData.chosenDayNum)
      classNameString += ` ${DATE_CHOSEN}`;
    if(classNameString === '')
      tdArray.push(<td key = {++keyForRender}><Link to = {`/day/${monthData.yearNum}/${monthData.monthNum + 1}/${i}`}>{getDoubleNumber(i)}</Link></td>);
    else 
      tdArray.push(<td className = {classNameString} key = {++keyForRender}><Link to = {`/day/${monthData.yearNum}/${monthData.monthNum + 1}/${i}`}>{getDoubleNumber(i)}</Link></td>);
          
    if(weekDayNum === 0 && i < monthData.inputDateLastDay) {
      trArray.push(tdArray);
      tdArray = [];
      //заполняем номер недели
      tdArray.push(<td className = {WEEK_NUMBER} key = {++keyForRender}>{getNumberOfWeek(new Date(monthData.yearNum, monthData.monthNum, i + 1))}</td>);
    };  
  };
  //заполняем оставшиеся клетки
  for (let i = monthData.lastWeekdayNum; i < 7; i++) {
    tdArray.push(<td key = {++keyForRender}></td>);
  };
  trArray.push(tdArray);
  tdArray = [];
  return trArray;
};

function getYearsAvailiableJSX(yearStart, yearEnd, additionalOption) {
  let optionsJSX = [];
  if(additionalOption)
    optionsJSX.push(<option key = {additionalOption} value = {additionalOption} >{additionalOption}</option>);
  for (let i = yearStart; i <= yearEnd; i++) {
    optionsJSX.push(<option key = {i} value = {i} >{i}</option>);
  };
  return optionsJSX;
};

function getComponentsArray(year, Component) {
  let monthComponentsArray = [];
  for(let i = 0; i <= 11; i++) {
    monthComponentsArray.push(
      <Component
        key = {i}
        yearNum = {year}
        monthNum = {i}
        chosenDay = {0}
        needMonthLink = {true}
      />
    );
  };
  return monthComponentsArray;
};
//вернет хэш с ключами monthComponentsArray, redirectToHomePage
function getMonthComponentsArray (year, Component) {
  let monthComponentsArray = [];
  if(year >= YEARS_AVAILIABLE_START && year <= YEARS_AVAILIABLE_END)
    monthComponentsArray = getComponentsArray(year, Component);  
  return monthComponentsArray;
};

function getRedirectToHomePageState (chosenYear, Component) {
  let redirectToHomePage = false;
  if( !(chosenYear >= YEARS_AVAILIABLE_START && chosenYear <= YEARS_AVAILIABLE_END) )
    redirectToHomePage = true;
  return redirectToHomePage;
};

function getChosenMonthTasksMap (isLoggedIn, users, yearNum, monthNum) {
  let chosenMonthTasksMap = null;
  if(isLoggedIn) {
    let loggedInUserData = users.find(element => element.userName === isLoggedIn);
    let loggedInUserTasks = loggedInUserData.length !== 0 && loggedInUserData.userTasks; 
    chosenMonthTasksMap = createChosenMonthTasksMap(loggedInUserTasks, yearNum, monthNum);
  };
  return chosenMonthTasksMap;
};
function getChosenMonthTasksJSX (isLoggedIn, chosenMonthTasksMap, Component) {
  let chosenMonthTasksJSX = [];
  if(chosenMonthTasksMap) {
    chosenMonthTasksMap.forEach((element, key) => {
      chosenMonthTasksJSX.push(<Component key = {key} taskDate = {key} tasks = {element} userName = {isLoggedIn}/>)
    });
  };
  return chosenMonthTasksJSX;
};

function validateLogInData(arrayOfUsers, userName, userPsw) {  
  let isValidated = {isValidated: false, nameInputError: null, pswInputError: null};
  let isNameValidated = false;
  let isPswValidated = false;
  let userNameMatch;
  if(userName) {
    userNameMatch = arrayOfUsers.filter(element => element.userName === userName);
    if(userNameMatch.length !== 0) 
      isNameValidated = true;
    else
      isValidated.nameInputError = 'There is no User with this name';
  }
  else
    isValidated.nameInputError = 'User Name field must be filled';
  
  if(userPsw) {
    let userPswMatch;
    if(userNameMatch && userNameMatch.length !== 0)
      userPswMatch = userNameMatch[0].userPassword;
    if(userPswMatch === userPsw) 
      isPswValidated = true;
    else
      isValidated.pswInputError = 'Password is invalid, please, try one more time';
  }
  else
    isValidated.pswInputError = 'Password field must be filled';

  if(isNameValidated && isPswValidated)
    isValidated.isValidated = true;
  return isValidated;
};

function validateCreateAccountData(arrayOfUsers, userName, userPsw, repeatUserPsw, termsOfUse) {  
  let isValidated = {isValidated: false, nameInputError: null, pswInputError: null, repeatPswInputError: null, termsOfUseError: null};
  let isNameValidated = false;
  let isPswValidated = false;
  let isRepeatPswValidated = false;
  if(userName) {
    let userNameMatch = arrayOfUsers.filter(element => element.userName === userName);
    if(userNameMatch.length !== 0) 
      isValidated.nameInputError = 'This name is already in use';
    else if(userName.length < 5) 
      isValidated.nameInputError = 'Minimum name length - 5 chars';
    else {
      let reg = /^[a-zA-Zа-яёА-Я0-9]+$/;
      if(reg.test(userName))
        if(userName.length < 20)
          isNameValidated = true;
        else
          isValidated.nameInputError = 'Maximum name length - 20 chars';
      else
        isValidated.nameInputError = 'Name should consist of cyrillic, latin letters or numbers';
    }      
  }
  else
    isValidated.nameInputError = 'User Name field must be filled';
  
  if(userPsw) {
    if(/[\w]+/.test(userPsw))
      isPswValidated = true;
    else
      isValidated.pswInputError = 'Please, use only chars and numbers';
  }
  else
    isValidated.pswInputError = 'Password field must be filled';
  if(repeatUserPsw) {
    if(repeatUserPsw === userPsw) 
      isRepeatPswValidated = true;
    else
      isValidated.repeatPswInputError = "Password doesn't match password from previous field";
  }
  else
    isValidated.repeatPswInputError = 'Repeat password field must be filled';
  if(!termsOfUse) {
    isValidated.termsOfUseError = "It is necessary to accept Terms Of Use";
  }

  if(isNameValidated && isPswValidated && isRepeatPswValidated && termsOfUse)
    isValidated.isValidated = true;
  return isValidated;
};

function getInitialFormData (taskDate, taskName, taskBody, taskTags) {
  return {
    dateInputValue: taskDate || '',
    dateInputError: null,
    taskNameInputValue: taskName || '',
    taskNameInputError: null,
    taskBodyInputValue: taskBody || '',
    taskBodyInputError: null,
    taskTagsInputValue: taskTags || '',
    taskTagsInputError: null,
  };
}
//ключи formData: dateInputValue, dateInputError, taskNameInputValue, taskNameInputError, 
//taskBodyInputValue, taskBodyInputError, taskTagsInputValue, taskTagsInputError
function validateTaskData(formData) {   
  let validationData = {isValidated: false, 
                        errorTexts: {
                          dateErrorMessage: null,
                          taskNameErrorMessage: null,
                          taskBodyErrorMessage: null,
                          taskTagsErrorMessage: null,
                        },
                      };
  let dateCheck = /^(\d{2}\.){2}\d{4}$/;
  let taskNameCheck = /^[\wА-Яа-яё\-.\\/? ]+$/;
  let taskBodyCheck = /^[\wА-Яа-яё\-.\\/? ]+$/;
  let taskTagsCheck = /^([\wА-Яа-яё]+, ?){0,4}[\wА-Яа-яё]+$/;

  if(formData.dateInputValue === '')
    validationData.errorTexts.dateErrorMessage = 'Task date field must be filled';
  else if(! dateCheck.test(formData.dateInputValue))
    validationData.errorTexts.dateErrorMessage = 'Please, enter date in "xx.xx.xxxx" format';
  else if(formData.dateInputValue.split('.')[2] > YEARS_AVAILIABLE_END || formData.dateInputValue.split('.')[2] < YEARS_AVAILIABLE_START){
    validationData.errorTexts.dateErrorMessage = `Please, enter year between ${YEARS_AVAILIABLE_START} and ${YEARS_AVAILIABLE_END}`;
  }
  else {    
    let numOfDaysIinMonth = getNumbersFromDate(new Date(formData.dateInputValue.split('.')[2], formData.dateInputValue.split('.')[1], 0)).dayNum;
    if(formData.dateInputValue.split('.')[0] > numOfDaysIinMonth)
      validationData.errorTexts.dateErrorMessage = `In this ${MONTH_NAMES[formData.dateInputValue.split('.')[1] - 1]} ${numOfDaysIinMonth} days, please, enter right day`;
  }

  if(formData.taskNameInputValue === '')
    validationData.errorTexts.taskNameErrorMessage = 'Task name field must be filled';
  else if(! taskNameCheck.test(formData.taskNameInputValue))
    validationData.errorTexts.taskNameErrorMessage = 'Task name must consist of letters, numbers and symbols -./\\?';
  else if(formData.taskNameInputValue.length > 15)
    validationData.errorTexts.taskNameErrorMessage = 'Task name must be max 15 chars';
  
  if(formData.taskBodyInputValue === '')
    validationData.errorTexts.taskBodyErrorMessage = 'Task body field must be filled';
  else if(! taskBodyCheck.test(formData.taskBodyInputValue))
    validationData.errorTexts.taskBodyErrorMessage = 'Task body can consists of letters, numbers and symbols -./\\?';
  else if(formData.taskBodyInputValue.length > 100)
    validationData.errorTexts.taskBodyErrorMessage = 'Task body must be max 100 chars';
  
  if(formData.taskTagsInputValue === '')
    validationData.errorTexts.taskTagsErrorMessage = null;
  else if(! taskTagsCheck.test(formData.taskTagsInputValue))
    validationData.errorTexts.taskTagsErrorMessage = 'Please, enter comma-saparated list of no more than 5 tags';
  else {
    let tags = formData.taskTagsInputValue.split(',');
    let badTags = tags.filter( element => element.length > 10);
    if (badTags.length > 0) {
      validationData.errorTexts.taskTagsErrorMessage = 'Each tag must be no more than 10 letters';
    }
  }

  if(!validationData.errorTexts.dateErrorMessage && !validationData.errorTexts.taskNameErrorMessage && !validationData.errorTexts.taskBodyErrorMessage && !validationData.errorTexts.taskTagsErrorMessage)
    validationData.isValidated = true;
  return validationData;
};

//ф-я проверки введенного текста
function escapeHTML(text) {
  if (!text) 
    return text;
  text = text.toString()
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
  return text;
};
//положить user в localStorage
function memoriseUserInLS (name, psw) {
  window.localStorage.setItem(LOCAL_STORAGE_STRING, JSON.stringify({userName: name, userPassword: psw}));
};

//возвращает options с месяцами для select
function getJSXFromArray(array, additionalOption) {
  let optionsJSX = [];
  if(additionalOption) 
    optionsJSX.push(<option key = {additionalOption} value = {additionalOption} >{additionalOption}</option>)
  for (let i = 0; i < array.length; i++) {
    optionsJSX.push(<option key = {i} value = {array[i]} >{array[i]}</option>);
  };
  return optionsJSX;
};

function getDaysJSX(numberOfDaysInMonth, additionalOption) {
  let optionsJSX = [];
  if(additionalOption) 
    optionsJSX.push(<option key = {additionalOption} value = {additionalOption} >{additionalOption}</option>)
  for (let i = 1; i <= numberOfDaysInMonth; i++) {
    optionsJSX.push(<option key = {i} value = {i} >{i}</option>);
  };
  return optionsJSX;
};

function createChosenDayTasksArray(tasksArray, yearNum, monthNum, dayNum) {
  let chosenDayTasksArray = [];
  if(tasksArray) {
    tasksArray.forEach( element => {
      let numbersFromDate = getNumbersFromDate(new Date(element.taskDate));
      if(numbersFromDate.yearNum === yearNum && numbersFromDate.monthNum - 1 === monthNum && numbersFromDate.dayNum === dayNum)
        chosenDayTasksArray.push(element);
    });
  };
  return chosenDayTasksArray;
};

function getChosenDayTasksArray(isLoggedIn, users, yearNum, monthNum, dayNum) {
  let chosenDayTasksArray = null;
  if(isLoggedIn) {
    let loggedInUserData = users.find(element => element.userName === isLoggedIn);
    let loggedInUserTasks = loggedInUserData && loggedInUserData.userTasks; 
    chosenDayTasksArray = createChosenDayTasksArray(loggedInUserTasks, yearNum, monthNum, dayNum);
  };
  return chosenDayTasksArray;
};

function createChosenMonthTasksMap(tasksArray, yearNum, monthNum) {
  let chosenMonthTasksMap = new Map();
  if(tasksArray) {
    tasksArray.forEach( element => {
      let numbersFromDate = getNumbersFromDate(new Date(element.taskDate));
      if(numbersFromDate.yearNum === yearNum && numbersFromDate.monthNum - 1 === monthNum) {
        let date = getDateString(new Date(element.taskDate));
        if(chosenMonthTasksMap.has(date)) {
          chosenMonthTasksMap.get(date).push(element);
        }
        else
          chosenMonthTasksMap.set(date, [element])
      }        
    });
  };
  return chosenMonthTasksMap;
};

function findUser(usersArray, userID) {
  let user = usersArray.find(element => element.userName === userID);
  return user || null;
};

function getUserLoggedInTasksArrayJSX (userTasks, Component, isLoggedIn) {
  let userLoggedInTasksArrayJSX = userTasks.map( element => {
    return <Component 
          key = {element.taskID}
          task = {element}
          needDate = {true}
          userName = {isLoggedIn}
          />
  });
  return userLoggedInTasksArrayJSX;
};
//возвращает хэш с ключами numOfPages - number, tasksOnPages - хэш с ключами-номерами страниц
function getTasksForPages(numOfTasksOnPage, tasksArray) {
  let tasksForPages = {numOfPages: 0, tasksOnPages: {}};
  let numOfPages = Math.ceil(tasksArray.length / numOfTasksOnPage);
  tasksForPages.numOfPages = numOfPages;
  if(numOfPages) {
    for(let i = 1; i <= numOfPages; i++) {
      if(i === numOfPages)
        tasksForPages.tasksOnPages[i] = tasksArray.slice((i-1) * numOfTasksOnPage);
      else
        tasksForPages.tasksOnPages[i] = tasksArray.slice((i-1) * numOfTasksOnPage, i * numOfTasksOnPage);
    };
  };
  return tasksForPages;
};

function getLinksForTasksPagesArray(numOfPages) {
  let linksForTasksPagesArray = [];
  for(let i = 1; i <= numOfPages; i++)
    linksForTasksPagesArray.push(<NavLink key = {i} to = {`/alltasks/${i}`} className = "TasksPageLink" activeClassName = "TasksPageLinkActive">{i}</NavLink>);
  return linksForTasksPagesArray;
};

function getFilteredByDateTasks(tasksArray, viewControlData) {
  let todayDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());
  if(viewControlData.showFromTodayDate)
    tasksArray = tasksArray.filter(element => {
      let match = false;
      let taskDateInNumbers = new Date(element.taskDate);
      if(taskDateInNumbers >= todayDate)
        match = true
      return match;
    });
  let filteredTasksArray;
  switch (true) {
    //все равны All
    case (viewControlData.yearValue === DEF_YEAR_VALUE && viewControlData.monthValue === DEF_MONTH_VALUE && viewControlData.dayValue === DEF_DAY_VALUE): 
      filteredTasksArray = tasksArray;
      break;
    //все не равны All
    case (viewControlData.yearValue !== DEF_YEAR_VALUE && viewControlData.monthValue !== DEF_MONTH_VALUE && viewControlData.dayValue !== DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        dateInNumbers.monthNum = dateInNumbers.monthNum - 1;
        if(dateInNumbers.yearNum === viewControlData.yearValue && dateInNumbers.monthNum === viewControlData.monthValue && dateInNumbers.dayNum === viewControlData.dayValue)
          return true;
        else
          return false;
      });
      break;
    //только year равен All
    case (viewControlData.yearValue === DEF_YEAR_VALUE && viewControlData.monthValue !== DEF_MONTH_VALUE && viewControlData.dayValue !== DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        dateInNumbers.monthNum = dateInNumbers.monthNum - 1;
        if(dateInNumbers.monthNum === viewControlData.monthValue && dateInNumbers.dayNum === viewControlData.dayValue)
          return true;
        else
          return false;
      });
      break;
    //только month равен All
    case (viewControlData.yearValue !== DEF_YEAR_VALUE && viewControlData.monthValue === DEF_MONTH_VALUE && viewControlData.dayValue !== DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        if(dateInNumbers.yearNum === viewControlData.yearValue && dateInNumbers.dayNum === viewControlData.dayValue)
          return true;
        else
          return false;
      });
      break;
    //только day равен All
    case (viewControlData.yearValue !== DEF_YEAR_VALUE && viewControlData.monthValue !== DEF_MONTH_VALUE && viewControlData.dayValue === DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        dateInNumbers.monthNum = dateInNumbers.monthNum - 1;
        if(dateInNumbers.yearNum === viewControlData.yearValue && dateInNumbers.monthNum === viewControlData.monthValue)
          return true;
        else
          return false;
      });
      break;
    //только year и month равен All
    case (viewControlData.yearValue === DEF_YEAR_VALUE && viewControlData.monthValue === DEF_MONTH_VALUE && viewControlData.dayValue !== DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        if(dateInNumbers.dayNum === viewControlData.dayValue)
          return true;
        else
          return false;
      });
      break;
    //только year и day равен All
    case (viewControlData.yearValue === DEF_YEAR_VALUE && viewControlData.monthValue !== DEF_MONTH_VALUE && viewControlData.dayValue === DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        dateInNumbers.monthNum = dateInNumbers.monthNum - 1;
        //console.log(dateInNumbers)
        console.log(viewControlData.monthValue)
        //console.log(viewControlData.monthValue)
        if(dateInNumbers.monthNum === viewControlData.monthValue)
          return true;
        else
          return false;
      });
      break;
    //только month и day равен All
    case (viewControlData.yearValue !== DEF_YEAR_VALUE && viewControlData.monthValue === DEF_MONTH_VALUE && viewControlData.dayValue === DEF_DAY_VALUE):
      filteredTasksArray = tasksArray.filter(element => {
        let dateInNumbers = getNumbersFromDate(new Date(element.taskDate));
        if(dateInNumbers.yearNum === viewControlData.yearValue)
          return true;
        else
          return false;
      });
      break;
    default: filteredTasksArray = tasksArray;
  };  
  return filteredTasksArray;
};

function getFilteredByTextTasks(tasksArray, viewControlData) {
  let filteredTasksArray = tasksArray.filter(element => {
    if(  element.taskName.indexOf(viewControlData.searchTaskNameValue) !== -1 
      && element.taskBody.indexOf(viewControlData.searchTaskBodyValue) !== -1 
      && element.taskTags.indexOf(viewControlData.searchTagValue) !== -1)
      return true;
    else
      return false;
  });
  return filteredTasksArray;
};

function getSortedTasks(tasksArray, viewControlData) {
  //sortByDate
  //sortByTaskName
  if(viewControlData.sortByDate)
    tasksArray = tasksArray.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate));
  else if(viewControlData.sortByTaskName)
    tasksArray = tasksArray.sort((a, b) => {
      if (b.taskName > a.taskName) {
        return 1;
      }
      if (b.taskName < a.taskName) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    });

  return tasksArray;
};

function getActionDataObject (action, data) {
  return {
    action: action,
    data: data,
  };
};

function getNewTaskObject(usersTasksInfo, isLoggedIn, formData) {
  let taskID = 0;
  for(let key in usersTasksInfo) {
    if(key === isLoggedIn)
      taskID = usersTasksInfo[isLoggedIn].maxIdValue + 1;
  };
  let taskDateNumbers = formData.dateInputValue.split('.');
  let taskDate = new Date(taskDateNumbers[2], taskDateNumbers[1] - 1, taskDateNumbers[0]);
  let taskObject = {...NEW_TASK_DATA_TEMPLATE, taskID: taskID, taskDate: taskDate, taskName: formData.taskNameInputValue,
    taskBody: formData.taskBodyInputValue, taskTags: formData.taskTagsInputValue};
  taskObject = JSON.parse(JSON.stringify(taskObject));//чтобы не было проблем при добавлении к распарсенному массиву с сервера
  return taskObject;
};

//хэш, ключ arr - массив существующих id, ключ maxIdValue - максимальное значение id (для заведения нового клиента)
function getExistingTasksId (arrOfTasks) {
  let arrOfTasksId = [];
  if(arrOfTasks.length !== 0) {
    arrOfTasksId = arrOfTasks.map( value => value.taskID);
  };  
  let maxIdValue = 0;
  if(arrOfTasksId.length !== 0)
    maxIdValue = arrOfTasksId.sort((a, b) => b - a)[0];
  return {arr: arrOfTasksId, maxIdValue: maxIdValue};  
};

function createUsersTasksInfo(arrOfUsers) {
  //хэш - ключ - имя пользователя, значение - хэш, arr - массив существующих id, maxIdValue - максимальное значение id (для заведения нового клиента)
  let newUsersTasksInfo = {};      
  arrOfUsers.forEach( element => {
    let userTasksIDInfo = getExistingTasksId(element.userTasks);
    newUsersTasksInfo[element.userName] = userTasksIDInfo;
  }); 
  return newUsersTasksInfo;
};

function checkLocalStorageIsLoggedIn (arrOfUsers) {
  //проверить в localStorage, залогинен ли кто-то
  let savedInLSUserRow = window.localStorage.getItem(LOCAL_STORAGE_STRING);
  let isLoggedIn = {userName: null, userPassword: null};
  if(savedInLSUserRow) {
    try{
      let savedInLSUser = JSON.parse(savedInLSUserRow);
      if(typeof(savedInLSUser) === 'object' && typeof(savedInLSUser.userName) === 'string' && typeof(savedInLSUser.userPassword) === 'string') {
        let userLoggedIn = arrOfUsers.find(element => element.userName === savedInLSUser.userName && element.userPassword === savedInLSUser.userPassword);
        if(userLoggedIn) {
          isLoggedIn.userName = savedInLSUser.userName;
          isLoggedIn.userPassword = savedInLSUser.userPassword;
        };
      };
    }
    catch(error) {
      console.log(`Произошла ошибка, Name: ${error.name}, Message: ${error.message}`);
    };
  };
  return isLoggedIn;
};

export {
  LOCAL_STORAGE_STRING,
  MONTH_NAMES,
  SHOW_BY,
  DEF_MONTH_VALUE,
  DEF_YEAR_VALUE,
  DEF_DAY_VALUE,
  YEARS_AVAILIABLE_START,
  YEARS_AVAILIABLE_END,
  NEW_USER_DATA_TEMPLATE,
  NEW_TASK_DATA_TEMPLATE,
  getNumbersFromDate,
  getNumberOfWeek,
  getMonthData,
  getDoubleNumber,
  getDateString,
  getDateFromString,
  getMonthTasksDaysArray,
  getTrJSXArray,
  getYearsAvailiableJSX,
  getComponentsArray,
  getMonthComponentsArray,
  getRedirectToHomePageState,
  validateLogInData,
  getInitialFormData,
  validateCreateAccountData,
  validateTaskData,
  escapeHTML,
  memoriseUserInLS,
  getJSXFromArray,
  getDaysJSX,
  getChosenDayTasksArray,
  getChosenMonthTasksMap,
  getChosenMonthTasksJSX,
  findUser,
  getUserLoggedInTasksArrayJSX,
  getTasksForPages,
  getLinksForTasksPagesArray,
  getFilteredByDateTasks,
  getFilteredByTextTasks,
  getSortedTasks,
  getActionDataObject,
  getNewTaskObject,
  createUsersTasksInfo,
  checkLocalStorageIsLoggedIn,
};