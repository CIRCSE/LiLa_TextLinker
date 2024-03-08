import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
const uuidv4 = require('uuid/v4');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

window.theTimeStamp = uuidv4();
// window.apiLiLaTestLinkerSiteUrlPrefix = "http://localhost:8080/LiLaTextLinker/"
window.apiLiLaTestLinkerSiteUrlPrefix = "http://localhost:8080/LiLa_text_linker_war/"
// window.apiLiLaTestLinkerSiteUrlPrefix = ""

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
