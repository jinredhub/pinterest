import React, { Component } from 'react';
import './Home.css';
import * as firebase from 'firebase';
import axios from '../../axios';
import {database} from "../../firebase";

import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Pin from '../../components/Pin/Pin';
import sampleImg from '../../assets/Swan_large_1450932169.jpg';

class Home extends Component {
    state={
        allUsers: [
            // {
            //     email: 'jin@nieblo.com',
            //     firstName: 'Jin',
            //     lastName: 'Redmond',
            //     yourPins: [],
            //     followingPins: []
            // }
        ],
        allPins: [
            // {
            //     title: 'test title1',
            //     imageUrl: sampleImg,
            //     webUrl: 'https://www.google.com/',
            //     pinId: 0,
            // },
            // {
            //     title: 'test title2',
            //     imageUrl: sampleImg,
            //     webUrl: 'weburl2.com',
            //     pinId: 11,
            // },
            // {
            //     title: 'test title3',
            //     imageUrl: sampleImg,
            //     webUrl: 'weburl3.com',
            //     pinId: 22,
            // },
            // {
            //     title: 'test title4',
            //     imageUrl: sampleImg,
            //     webUrl: 'weburl4.com',
            //     pinId: 33,
            // },
            // {
            //     title: 'test title5',
            //     imageUrl: sampleImg,
            //     webUrl: 'weburl5.com',
            //     pinId: 44,
            // },
        ],
        showModal: false,
        canSaveButton: false,
    };

    componentDidMount(){
        console.log('component did mount');
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
                console.log('load: ',res.data);

                // firebase won't store empty array, so create empty array here
                for(let user of res.data.allUsers){
                    if(!user.yourPins){
                        user.yourPins = [];
                    }
                    if(!user.followingPins){
                        user.followingPins = [];
                    }
                }
                console.log('new res.data: ', res.data);
                this.setState({
                    allUsers: res.data.allUsers,
                    dbLoaded: true,
                    lastPinId: res.data.lastPinId,
                });
                this.setStateAllPins();
            })
            .catch(err=>console.log(err));
    };

    updateDatabase = (allUsers) =>{
        console.log('updatemethod: ', this.state.allUsers);
        console.log('pass allusers:', allUsers);

        const data = [...this.state.allUsers];
        const lastPinId = this.state.lastPinId;
        database.ref("-KsvSXlLmZRq_i-pAUhx").set({
            allUsers: data,
            lastPinId: lastPinId,
        });
    }

    setStateAllPins = () =>{
        const loginEmail = this.state.loginEmail;
        // console.log('loginEmail: ', loginEmail);
        const allUsers = [...this.state.allUsers];
        // console.log('allusers: ', allUsers);

        // get all pins except your own and following pins
        const copyAllUsers = [...this.state.allUsers];
        // console.log('copyallusers: ', copyAllUsers);

        const userIndex = copyAllUsers.findIndex(val=>{
            return val.email === loginEmail;
        });
        // console.log('userindex: ', userIndex);
        // console.log('copytallusers: ', copyAllUsers);
        copyAllUsers.splice(userIndex, 1);
        // console.log('copyAllUsers: ', copyAllUsers);
        const pinsToDisplayWithFollowingPins = [];
        for(let user of copyAllUsers){
            for(let pin of user.yourPins){
                pinsToDisplayWithFollowingPins.push(pin);
            }
        }

        console.log('pinsToDisplayWithFollowingPins: ',pinsToDisplayWithFollowingPins);
        // console.log('allusers', allUsers[userIndex]);
        // minus your following pins
        const yourFollowingPins = allUsers[userIndex].followingPins;
        // console.log('yourFollowingPins: ', yourFollowingPins);
        const indexes = [];

        // use remove multi items from array method
        if(yourFollowingPins.length){
            for(let remVal of yourFollowingPins){
                indexes.push(pinsToDisplayWithFollowingPins.findIndex(function(val){
                    return val.pinId === remVal.pinId;
                }));
            }

            // console.log('remove index: ', indexes);

            // sort indexes array
            const sortedIndexes = indexes.sort(function(a, b){ return a - b});
            // console.log('sorted index: ', sortedIndexes);

            for(let i=sortedIndexes.length-1; i>=0; i--){
                pinsToDisplayWithFollowingPins.splice(sortedIndexes[i], 1);
            }

            // console.log('new pinsto display: ', pinsToDisplayWithFollowingPins);

        }

        this.setState({allPins: pinsToDisplayWithFollowingPins});
    }

    logOutHandler = () =>{
        console.log('logging out');
        firebase.auth().signOut();
    }

    inputTextHandler = (ev, type) =>{
        if(type === 'title'){
            this.setState({title: ev.target.value})
        }
        else if(type === 'webUrl'){
            this.setState({webUrl: ev.target.value});
        }
        else if(type === 'file'){
            this.setState({imageUrl: ev.target.files[0]});
        }
    };

    // modal handlers----------------------------------------
    createPinHandler = (email) =>{
        // console.log('create pin state: ', this.state);
        if(this.state.title && this.state.imageUrl && this.state.webUrl){
            const newPin = {};
            newPin.title = this.state.title;
            newPin.imageUrl = this.state.imageUrl;
            newPin.webUrl = this.state.webUrl;

            let lastPinId = this.state.lastPinId;
            console.log('last id: ', lastPinId);
            newPin.pinId = lastPinId+1;
            console.log('++: ', newPin.pinId);

            // disable save button
            // update count
            this.setState({
                canSaveButton: true,
                lastPinId: newPin.pinId,
            });

            // get the fle
            const file = this.state.imageUrl;

            // create a storage ref
            const storageRef = firebase.storage().ref('uploadedImgFolder/' + file.name);

            // upload file. Update state and db when finish
            storageRef.put(file).then(function(){
                // get the img url
                const storage = firebase.storage().ref();
                storage.child('uploadedImgFolder/'+file.name).getDownloadURL().then(function(url){
                    console.log('url: ', url);
                    newPin.imageUrl = url;
                    // newPin.imageUrl = 'test url';

                    // console.log('email: ', email);
                    const allUsers = [...this.state.allUsers];
                    console.log("-----", allUsers);
                    const userIndex = allUsers.findIndex(val=>{
                        return val.email === email;
                    });
                    console.log('----', userIndex);
                    allUsers[userIndex].yourPins.push(newPin);
                    this.closeModalHandler();

                    this.updateDatabase(allUsers);

                    // enable save button
                    this.setState({
                        canSaveButton: false,
                        title: '',
                        webUrl: '',
                        imageUrl: '',
                    })
                }.bind(this));
            }.bind(this));
        }
    };

    showModal = () =>{
        this.setState({showModal: true});
    };
    closeModalHandler = () =>{
        this.setState({showModal: false});
    };

    // pin handlers-------------------------------------------
    webUrlHandler = (webUrl) =>{
        console.log('url: ', webUrl);
        window.open(webUrl);
    };

    savePinHandler = (pinId) =>{
        console.log('pinId: ', pinId);
        const allPins = [...this.state.allPins];
        // console.log('allpins: ', allPins);
        const indexOfPin = allPins.findIndex(val=>{
            return val.pinId === pinId;
        });

        // console.log('index', indexOfPin);
        const loginEmail = this.state.loginEmail;
        const allUsers = [...this.state.allUsers];
        const indexOfUser = allUsers.findIndex(val=>{
            return val.email === loginEmail;
        });
        // console.log('indexofuser: ', indexOfUser);

        allUsers[indexOfUser].followingPins.push(allPins[indexOfPin]);

        this.setState({
            allUsers: allUsers
        });

        console.log(this.state);
        this.updateDatabase();

        this.setStateAllPins();
    };

    render(){
        let pins = null;
        if(this.state.dbLoaded){
            console.log("===============================",this.state);
            if(this.state.allPins && this.state.allPins.length){
                pins = this.state.allPins.map(pin=>{
                    return <Pin
                        title={pin.title}
                        imageUrl={pin.imageUrl}
                        webUrl={pin.webUrl}
                        key={pin.pinId}
                        onWebUrlClicked={this.webUrlHandler.bind(this, pin.webUrl)}
                        onPinSaveButtonClicked={this.savePinHandler.bind(this, pin.pinId)}/>
                });
            }
            else{
                pins = <p>There are no pins to display</p>;
            }
        }

        return (
            <div className='Home'>
                <Navbar>
                    <a href="/home">Home</a>
                    <a href="/pins">your pins</a>
                    <a href="/following">following pins</a>
                    <Button
                        color='primary'
                        onClick={this.showModal}>create pin</Button>
                    <Button
                        color='primary'
                        onClick={this.logOutHandler}>Log out</Button>
                </Navbar>

                <Modal
                    title='Create your pin'
                    onSaveBtnClicked={this.createPinHandler.bind(this, this.state.loginEmail)}
                    onCloseBtnClicked={this.closeModalHandler}
                    showModal={this.state.showModal}
                    canSaveButton={this.state.canSaveButton}
                >
                    <div className="bodyContainer">
                        <Input
                            inputtype='input'
                            type='text'
                            label='Add a title'
                            onChange={(ev)=>this.inputTextHandler(ev, 'title')}/>
                        <br/>
                        <Input
                            inputtype='input'
                            type='text'
                            label='Type a website url'
                            onChange={(ev)=>this.inputTextHandler(ev, 'webUrl')}/>
                        <br/>
                        <Input
                            inputtype='input'
                            type='file'
                            label='upload file'
                            onChange={(ev)=>this.inputTextHandler(ev, 'file')}/>
                    </div>
                </Modal>
                <div className='pinsContainer'>
                    {pins}
                </div>

            </div>
        )
    }
}

export default Home;