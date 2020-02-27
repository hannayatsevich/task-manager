import React from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import LoadingPage from './components/LoadingPage';
import Header from './components/Header';
import MainPage from './components/MainPage';
import Footer from './components/Footer';

import {getUsersDataThunkAC} from '../src/redux/actionCreators';

class App extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.number.isRequired,//redux - state.taskManagerUsersData.mode, 1 - загрузка, 2 - ошибка, 3 - данные получены
    isLoggedIn: PropTypes.string,//redux - state.taskManagerUsersData.isLoggedIn.userName, //логин пользователя или null
  };
  
  componentDidMount() {
    this.props.dispatch( getUsersDataThunkAC(this.props.dispatch) );    
  };
  
  render() {
    //console.log(`App render in mode ${this.props.mode}`)
    if (this.props.mode <= 1) 
      return <LoadingPage mode = {this.props.mode}/>;      
    if (this.props.mode === 2)
      return <LoadingPage mode = {this.props.mode}/>;  
    return (      
      <BrowserRouter>      
        <div className = 'TaskManager'>
          <Header userName = {this.props.isLoggedIn}/>
          <MainPage />
          <Footer />          
        </div>      
      </BrowserRouter>           
    );
  };  
};

const mapStateToProps = function (state) {
  return {
    mode: state.taskManagerUsersData.mode,
    isLoggedIn: state.taskManagerUsersData.isLoggedIn.userName,
 };
};

export default connect(mapStateToProps)(App);
