import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';

// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyA-143MQQsB75aYzr2-JV4eeFi_j60Z9_Q",
//     authDomain: "trainscheduler-d3a50.firebaseapp.com",
//     databaseURL: "https://trainscheduler-d3a50.firebaseio.com",
//     projectId: "trainscheduler-d3a50",
//     storageBucket: "trainscheduler-d3a50.appspot.com",
//     messagingSenderId: "13218449554"
// };
// firebase.initializeApp(config);

var firebaseConfig = {
    apiKey: "AIzaSyA-143MQQsB75aYzr2-JV4eeFi_j60Z9_Q",
    authDomain: "trainscheduler-d3a50.firebaseapp.com",
    databaseURL: "https://trainscheduler-d3a50.firebaseio.com",
    projectId: "trainscheduler-d3a50",
    storageBucket: "trainscheduler-d3a50.appspot.com",
    messagingSenderId: "13218449554",
    appId: "1:13218449554:web:fcc0553efc67cb3d7bfe4b"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// looks like i need to create app from console to get below info



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
