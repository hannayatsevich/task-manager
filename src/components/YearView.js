import React from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {rememberLastUrlAC} from '../redux/actionCreators';
import MonthComponent from './MonthComponent';
import {YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END, 
        getYearsAvailiableJSX, getMonthComponentsArray, 
        getRedirectToHomePageState} from './_functionsAndConstants';

import '../styles/YearView.css';

class YearView extends React.PureComponent{
  
  constructor(props) {
    super(props);

    let chosenYear = Number(props.match.params.yearNum);//номер года из параметра ссылки
    
    this.selectRef = React.createRef();

    this.state = {
      yearsAvailiableJSX: getYearsAvailiableJSX(YEARS_AVAILIABLE_START, YEARS_AVAILIABLE_END),//options с годами для select 
      chosenYear: chosenYear,//выбранный год, для сверки с props 
      monthComponentsArray: getMonthComponentsArray(chosenYear, MonthComponent),//массив MonthComponent из 12 месяцев для выбранного года
      redirectToHomePage: getRedirectToHomePageState(chosenYear),//корректный ли год введен в параметре ссылки - если нет, то redirectToHomePage = true
    };
  };   
  
  setYear = () => {
    let chosenYear = parseInt(this.selectRef.current.value);//не требуется новый monthComponentsArray, т.к при смене года - роутинг
    this.setState({chosenYear: chosenYear});
  };
  UNSAFE_componentWillReceiveProps(nextProps) {    
    let chosenYear = Number(nextProps.match.params.yearNum);//номер года из параметра ссылки
    this.setState({chosenYear: chosenYear, 
                  monthComponentsArray: getMonthComponentsArray(chosenYear, MonthComponent), 
                  redirectToHomePage: getRedirectToHomePageState(chosenYear)});
  };
  componentDidMount() {
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  componentDidUpdate() {    
    this.props.dispatch(rememberLastUrlAC(this.props.match.url));
  };
  render() {
    if (this.state.redirectToHomePage) {
      //console.log('YearView render redirect to homepage')
      return <Redirect to = '/'/>
    }
    else if(this.state.chosenYear !== parseInt(this.props.match.params.yearNum)) {
      //console.log('YearView render redirect')
      return <Redirect to = {`/year/${this.state.chosenYear}`}/>
    }
    else {
      //console.log('YearView render')
      return (
      <div className = 'YearView'>
        <p><span>Choose year </span><select ref = {this.selectRef} onChange = {this.setYear} value = {this.state.chosenYear}>{this.state.yearsAvailiableJSX}</select></p>
        <div className = 'YearTables'>{this.state.monthComponentsArray}</div>
      </div>
      );
    };
  };
};

export default connect()(YearView);