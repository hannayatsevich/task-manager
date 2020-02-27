import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage = (props) => {
  //console.log('LoadingPage render');
  return (
    <div className = 'LoadingPage'>
      { props.mode <= 1 && <p>Loading...</p>}
      { props.mode === 2 && <p>Loading error</p>}      
    </div>
  );
};

export default LoadingPage;