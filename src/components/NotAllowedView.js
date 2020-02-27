import React from 'react';
import {Link} from 'react-router-dom';

const NotAllowedView = (classNameString) => {
  return (
    <div className = {classNameString}>
      Please, <Link to="/login"  className = "LogLink" >log in</Link> or <Link to="/newaccount"  className = "LogLink" >create account</Link> to see your tasks
    </div>
  );
};

export default NotAllowedView;