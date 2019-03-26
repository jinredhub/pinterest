import React, { Component } from 'react';
import './Pins.css';
import * as firebase from 'firebase';

import Navbar from '../../components/Navbar/Navbar';
import Pin from "../../components/Pin/Pin";
import sampleImg from "../../assets/Swan_large_1450932169.jpg";
import axios from "../../axios";
import Button from "../../components/Button/Button";

class Pins extends Component{
    state={
        allUsers: [
            // {
            //     email: 'jin@nieblo.com',
            //     firstName: 'Jin',
            //     lastName: 'Redmond',
            //     yourPins: [
            //         {
            //             title: 'test title1',
            //             imageUrl: sampleImg,
            //             webUrl: 'https://www.google.com/',
            //             pinId: 0,
            //         },
            //         {
            //             title: 'test title2',
            //             imageUrl: sampleImg,
            //             webUrl: 'weburl2.com',
            //             pinId: 11,
            //         },
            //     ],
            //     followingPins: []
            // }
        ],
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                this.setState({ loginEmail: firebaseUser.email });

                const user = firebase.auth().currentUser;
                // console.log('current user: ', user);
                this.loadDatabase();
            }
            else{
                const url = '/';
                window.location.href = url;
                console.log('not logged in');
            }
        });
    }

    loadDatabase = () =>{
        axios.get('/.json')
            .then(res=>{
                // console.log('load: ',res.data);

                // firebase won't store empty array, so create empty array here
                for(let user of res.data.allUsers){
                    if(!user.tweets){
                        user.tweets = [];
                    }
                    if(!user.following){
                        user.following = [];
                    }
                }
                console.log('new res.data: ', res.data);
                this.setState({
                    allUsers: res.data.allUsers,
                    dbLoaded: true,
                });
            })
            .catch(err=>console.log(err));
    }

    logOutHandler = () =>{
        console.log('logging out');
        firebase.auth().signOut();
    }

    // pin handlers-------------------------------------------
    webUrlHandler = (webUrl) =>{
        console.log('url: ', webUrl);
        window.open(webUrl);
    };

    render(){
        let pins = null;

        if(this.state.dbLoaded){
            console.log('======================', this.state);
            const allUsers = [...this.state.allUsers];
            const loginEmail = this.state.loginEmail;
            console.log('loginEmail: ', loginEmail);
            const userIndex = allUsers.findIndex(val=>{
                return val.email === loginEmail;
            });
            const currentUser = allUsers[userIndex];
            console.log('currentUser: ', currentUser);

            if(currentUser.yourPins && currentUser.yourPins.length){
                pins = currentUser.yourPins.map((pin)=>{
                    return <Pin
                        title={pin.title}
                        imageUrl={pin.imageUrl}
                        webUrl={pin.webUrl}
                        key={pin.pinId}
                        onWebUrlClicked={this.webUrlHandler.bind(this, pin.webUrl)}/>
                });
            }
            else{
                pins = <p>There are no Pins to display</p>;
            }
        }

        return (
            <div className='Pins'>
                <Navbar>
                    <a href="/home">Home</a>
                    <a href="/following">following pins</a>
                    <Button
                        onClick={this.logOutHandler}>Log out</Button>
                </Navbar>
                <div className="pinsContainer">
                    {pins}
                </div>
            </div>
        )
    }
}

export default Pins;