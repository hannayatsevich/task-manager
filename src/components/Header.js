import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {NavLink, Link} from 'react-router-dom';
import {getNumbersFromDate, getDateString} from './_functionsAndConstants';
import {switchUserStatusAC} from '../redux/actionCreators';
import '../styles/Header.css'

class Header extends React.PureComponent{
  static propTypes = {
    lastVisitedUrl: PropTypes.string, //redux - lastVisitedUrl: state.taskManagerUsersData.lastVisitedUrl,
    userName: PropTypes.string,
  };
  
  logOutUser = () => {
    this.props.dispatch( switchUserStatusAC(null, null) );
  };

  render(){
    //console.log('Header render');    
    return (
      <header className = 'Header'>
        <div className = 'TodayDate'><p>Sunny day</p><p>{getDateString(new Date())}</p></div>
        <nav className = 'MenuBtns'>          
          <NavLink to = "/newtask" className = "MenuLink" activeClassName = "ActiveMenuLink">+ New task</NavLink>
          <NavLink to = {`/year/${(new Date()).getFullYear()}`} className = {this.props.lastVisitedUrl.indexOf('year') !== -1 ? "MenuLink ActiveMenuLink" : "MenuLink"} activeClassName = "ActiveMenuLink">Year</NavLink>
          <NavLink to = {`/month/${(new Date()).getFullYear()}/${(new Date()).getMonth() + 1}`} className = {this.props.lastVisitedUrl.indexOf('month') !== -1 ? "MenuLink ActiveMenuLink" : "MenuLink"} activeClassName = "ActiveMenuLink">Month</NavLink>
          <NavLink to = {`/day/${getNumbersFromDate(new Date()).yearNum}/${getNumbersFromDate(new Date()).monthNum}/${getNumbersFromDate(new Date()).dayNum}`} className = {this.props.lastVisitedUrl.indexOf('day') !== -1 ? "MenuLink ActiveMenuLink" : "MenuLink"} activeClassName = "ActiveMenuLink">Day</NavLink>
          <NavLink to = "/alltasks/1" className = "MenuLink" activeClassName = "ActiveMenuLink">All tasks</NavLink>          
        </nav>
        {this.props.userName 
        ? <div className = 'AuthorizationInfo'>
            <p>{this.props.userName}</p>
            <p><Link to = '' className = "LogLink" onClick = {this.logOutUser}>Log out</Link></p>
          </div>
        : <div className = 'AuthorizationBtns'>
            <p><NavLink to="/login"  className = "LogLink" activeClassName = "ActiveLogLink">Log in</NavLink></p>
            <p><NavLink to="/newaccount"  className = "LogLink" activeClassName = "ActiveLogLink">Create account</NavLink></p>       
          </div>}        
      </header>
    );
  };
};

const mapStateToProps = function (state) {
  return {
    lastVisitedUrl: state.taskManagerUsersData.lastVisitedUrl,
 };
};

export default connect(mapStateToProps)(Header);

