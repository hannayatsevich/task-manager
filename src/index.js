import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

import combinedReducers from './redux/reducers.js';
import App from './App';
import './index.css';

let store = createStore(combinedReducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>, 
  document.getElementById('root')
);
