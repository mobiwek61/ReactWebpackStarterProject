import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import { ReactAppForDevelopment } from './ReactAppForDevelopment'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>This is where the JSX to be shown by React.js goes, in index.js<br/>
    Typically, code here would call an external module to do the real work</>
  // < ReactAppForDevelopment />
)
// note: <React.StrictMode/> tags removed, as it won't run
