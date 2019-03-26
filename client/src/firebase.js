import * as firebase from "firebase";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA-143MQQsB75aYzr2-JV4eeFi_j60Z9_Q",
    authDomain: "trainscheduler-d3a50.firebaseapp.com",
    databaseURL: "https://trainscheduler-d3a50.firebaseio.com",
    projectId: "trainscheduler-d3a50",
    storageBucket: "trainscheduler-d3a50.appspot.com",
    messagingSenderId: "13218449554"
};
firebase.initializeApp(config);

const database = firebase.database();

export {database};