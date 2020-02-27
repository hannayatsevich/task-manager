import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {NEW_USER_DATA_TEMPLATE, escapeHTML, 
        validateCreateAccountData, 
        getActionDataObject} from './_functionsAndConstants';
import {ADD_NEW_USER, getUsersDataThunkForActionAC} from '../redux/actionCreators';

import '../styles/CreateNewAccountView.css';

class CreateNewAccountView extends React.PureComponent{
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,//redux - state.taskManagerUsersData.users
    isLoggedIn: PropTypes.object.isRequired,//redux - state.taskManagerUsersData.isLoggedIn, //логин, пароль пользователя или null, null 
    lastVisitedUrl: PropTypes.string.isRequired,//redux - state.taskManagerUsersData.lastVisitedUrl
  };
  constructor(props) {
    super(props);

    this.nameInputRef = React.createRef();
    this.pswInputRef = React.createRef();
    this.repeatPswInputRef = React.createRef();
    this.checkTermsOfUseRef = React.createRef();

    this.state = {  
      nameInputValue: '',
      nameInputError: null,
      pswInputValue: '',
      pswInputError: null,
      repeatPswInputValue: '',
      repeatPswInputError: null,
      termsOfUseValue: true,
      termsOfUseError: null,
      isValidated: false,    
      redirectCancel: false,
      redirectCreate: false,
    };
  };
  validateInputs = () => {
    let nameValue = escapeHTML(this.nameInputRef.current.value);
    let pswValue = escapeHTML(this.pswInputRef.current.value);
    let repeatPswValue = escapeHTML(this.repeatPswInputRef.current.value);
    let termsOfUseValue = this.checkTermsOfUseRef.current.checked;
    let validationInfo = validateCreateAccountData(this.props.users, nameValue, pswValue, repeatPswValue, termsOfUseValue);
    this.setState({nameInputValue: nameValue, 
                  pswInputValue: pswValue, 
                  repeatPswInputValue: repeatPswValue, 
                  isValidated: validationInfo.isValidated, 
                  nameInputError: validationInfo.nameInputError, 
                  pswInputError: validationInfo.pswInputError, 
                  repeatPswInputError: validationInfo.repeatPswInputError, 
                  termsOfUseError: validationInfo.termsOfUseError})
  };  
  createAccount = () => {
    let actionDataObject = getActionDataObject(ADD_NEW_USER, {...NEW_USER_DATA_TEMPLATE, userName: this.state.nameInputValue, userPassword: this.state.pswInputValue});
    this.props.dispatch(getUsersDataThunkForActionAC(this.props.dispatch, actionDataObject));
    this.setState({redirectCreate: true});
  };
  cancelCreateAccount = () => {
    this.setState({redirectCancel: true});
  };
  render() {
    if(this.state.redirectCreate) {
      //console.log('CreateAccountView render NotAllowed');
      return <Redirect to = '/'/>;
    }
    else if(this.state.redirectCancel) {
      //console.log('CreateAccountView render redirect');
      return <Redirect to = {this.props.lastVisitedUrl}/>;
    }
    else {
      //console.log('CreateAccountView render');
      return (        
        <div className = 'CreateAccountView'>
          <div className = 'CreateAccountWindow'>
            <p>User Name</p>
            <p><input type = 'text' autoFocus value = {this.state.nameInputValue} ref = {this.nameInputRef} onChange = {this.validateInputs}/></p>
            <p className = 'ErrorMsg'>{this.state.nameInputError && <span>{this.state.nameInputError}</span>}</p>
            <p>User Password</p>
            <p><input type = 'text' value = {this.state.pswInputValue} ref = {this.pswInputRef} onChange = {this.validateInputs}/></p>
            <p className = 'ErrorMsg'>{this.state.pswInputError && <span>{this.state.pswInputError}</span>}</p>
            <p>Repeat User Password</p>
            <p><input type = 'text' value = {this.state.repeatPswInputValue} ref = {this.repeatPswInputRef} onChange = {this.validateInputs}/></p>
            <p className = 'ErrorMsg'>{this.state.repeatPswInputError && <span>{this.state.repeatPswInputError}</span>}</p>
            <p><input type = 'checkbox' defaultChecked = {this.state.termsOfUseValue} ref = {this.checkTermsOfUseRef} onChange = {this.validateInputs}/>{'Accept Terms Of Use'}</p>
            <p className = 'ErrorMsg'>{this.state.termsOfUseError && <span>{this.state.termsOfUseError}</span>}</p>
            <p>
              <input type = 'button' value = 'Create account' disabled = {!this.state.isValidated} onClick = {this.createAccount}/>
              <input type = 'button' value = 'Cancel' onClick = {this.cancelCreateAccount}/>
            </p>            
          </div>          
        </div>        
      );
    };
  };
};

const mapStateToProps = function (state) {
  return {
    users: state.taskManagerUsersData.users,
    isLoggedIn: state.taskManagerUsersData.isLoggedIn,
    lastVisitedUrl: state.taskManagerUsersData.lastVisitedUrl,
 };
};

export default connect(mapStateToProps)(CreateNewAccountView);
