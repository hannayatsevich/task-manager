import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NewTaskPage from './NewTaskPage';
import YearView from './YearView';
import MonthView from './MonthView';
import DayView from './DayView';
import AllTasksView from './AllTasksView';
import LogInView from './LogInView';
import CreateNewAccountView from './CreateNewAccountView';

import '../styles/MainPage.css';

class MainPage extends React.PureComponent{  
  render() {
    //console.log('MainPage render');
    return (      
      <main className = 'MainPage'>
        <Switch>
          <Route path = "/" exact component = {() => <Redirect to = {`/year/${(new Date()).getFullYear()}`}/>}/>} />
          <Route path = "/newtask/" exact component={NewTaskPage} />  
          <Route path = "/year/:yearNum/" exact component = {YearView} />
          <Route path = "/month/:yearNum/:monthNum/" exact component = {MonthView} />
          <Route path = "/day/:yearNum/:monthNum/:chosenDay/" exact component = {DayView} />
          <Route path = "/alltasks/:page/" component = {AllTasksView} />  

          <Route path="/login/" exact component={LogInView} />
          <Route path="/newaccount/" exact component={CreateNewAccountView} />  

          <Route render = {() => <div className = 'PageNotFound'>Page not found. Sorry.</div>} />
        </Switch>      
      </main>      
    );
  };
};

export default MainPage;
