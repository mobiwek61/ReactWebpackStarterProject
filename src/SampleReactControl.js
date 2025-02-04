import React, { ReactDOM, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet, useParams,  useNavigate, useLocation } from "react-router-dom";

function SampleReactControl() {
  /* useEffect??  In the React world "useEffect" is a component lifecycle function. 
     Controlled by argument 2 as follows:
     missing: run always;  [] empty: run only once when component mounts; 
     [foo] run when useState foo changes */
  useEffect(() => { 
    console.log('SampleReactControl has loaded. Put code here which is slow, like accessing a backend.' +
        '\nWhile the slow thing happens, the user still sees a page and can do things without freezing.'
    ) 
  }, []); 
  // in return, the JSX output is defined to show in browser. 
  // If you dont have a return, page is blank!
  return <>
    <div className='blockyMsg' 
    style={{ border: '4px solid #00ff00' }}>
        Here is a React functional control called SampleReactControl!
    </div>
    </>
}

function RouterControlSample() {
    return <>
    <BrowserRouter>
      <Routes>
          <Route path='/' // this route always taken. Serves as menu frame for content
              //       ^ all routes hit this one because its /
              element={ <div id='reactRouterTopRoute' className='blockyMsg' style={{ border: '4px solidrgb(102, 33, 214)' }} >
                            Hello from RouterControlSample, path '/'</div>}>    
          </Route> {/*  <Route path='/' */}
      </Routes>
    </BrowserRouter></>
}

export { SampleReactControl, RouterControlSample }