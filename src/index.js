import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SampleReactControl, RouterControlSample } from './SampleReactControl'

const root = ReactDOM.createRoot(document.getElementById('root'));
// below is JSX code. It's like HTML embedded in javascript.
root.render(<>  {/* always enclose JSX in a single top level element */}
  Hi from index.js<br/>
    Search for "bluesky" to find this source code.
  <SampleReactControl/>
  <RouterControlSample/>
  </>
)
// note: <React.StrictMode/> tags removed, as it won't run
