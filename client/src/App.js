import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Pins from './pages/Pins/Pins';
import FollowingPins from './pages/FollowingPins/FollowingPins';

class App extends Component {

  render() {
    return (
        <BrowserRouter>
            <div className="App">
                <Route path='/home' exact component={Home}/>
                <Route path='/' exact component={Login}/>
                <Route path='/signup' exact component={Signup}/>
                <Route path='/pins' exact component={Pins}/>
                <Route path='/following' exact component={FollowingPins}/>
            </div>
        </BrowserRouter>
    );
  }
}

export default App;
