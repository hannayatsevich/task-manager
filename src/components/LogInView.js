import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {switchUserStatusAC} from '../redux/actionCreators';
import {escapeHTML, validateLogInData} from './_functionsAndConstants';

import '../styles/LogInView.css';

class LogInView extends React.PureComponent{
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,//redux - state.taskManagerUsersData.users
    isLoggedIn: PropTypes.object.isRequired,//redux - state.taskManagerUsersData.isLoggedIn, //логин, пароль пользователя или null, null
    lastVisitedUrl: PropTypes.string.isRequired,//redux - state.taskManagerUsersData.lastVisitedUrl
  };
  constructor(props) {
    super(props);

    this.nameInputRef = React.createRef();
    this.pswInputRef = React.createRef();

    this.state = {  
      nameInputValue: '',
      nameInputError: null,
      pswInputValue: '',
      pswInputError: null,
      isValidated: false,
      redirect: false,
    };
  };

  validateInputs = () => {
    let nameValue = escapeHTML(this.nameInputRef.current.value);
    let pswValue = escapeHTML(this.pswInputRef.current.value);
    let validationInfo = validateLogInData(this.props.users, nameValue, pswValue);
    this.setState({nameInputValue: nameValue, pswInputValue: pswValue, isValidated: validationInfo.isValidated, nameInputError: validationInfo.nameInputError, pswInputError: validationInfo.pswInputError})
  };
  logInUser = () => {    
    this.props.dispatch(switchUserStatusAC(this.state.nameInputValue, this.state.pswInputValue));
    this.setState({redirect: true});
  };
  cancelLogInUser = () => {
    this.setState({redirect: true});
  };

  render() {
    //console.log('LogInView render');
    if(this.state.redirect)
      return <Redirect to = {this.props.lastVisitedUrl}/>;
    else
      return (        
        <div className = 'LogInView'>
          <div className = 'LogInWindow'>
            <p>User Name</p>
            <p><input type = 'text' autoFocus value = {this.state.nameInputValue} onChange = {this.validateInputs} ref = {this.nameInputRef}/></p>
            <p className = 'ErrorMsg'>{this.state.nameInputError && <span>{this.state.nameInputError}</span>}</p>
            <p>User Password</p>
            <p><input type = 'text' value = {this.state.pswInputValue} onChange = {this.validateInputs} ref = {this.pswInputRef}/></p>
            <p className = 'ErrorMsg'>{this.state.pswInputError && <span>{this.state.pswInputError}</span>}</p>
            <p>
              <input type = 'button' value = 'Log in' disabled = {!this.state.isValidated} onClick = {this.logInUser}/>
              <input type = 'button' value = 'Cancel' onClick = {this.cancelLogInUser}/>
            </p>
          </div>       
        </div>        
      );
    };
};

const mapStateToProps = function (state) {
  return {
    users: state.taskManagerUsersData.users,
    isLoggedIn: state.taskManagerUsersData.isLoggedIn,
    lastVisitedUrl: state.taskManagerUsersData.lastVisitedUrl,
 };
};

export {LogInView};
export default connect(mapStateToProps)(LogInView);
