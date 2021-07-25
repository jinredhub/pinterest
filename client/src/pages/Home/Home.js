import React, { Component } from 'react';
import './Home.css';
import firebase from 'firebase';
import axios from '../../axios';
// import {database} from "../../firebase";

import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import Input2 from '../../components/Input2/Input2';
import Button from '../../components/Button/Button';
import Pin from '../../components/Pin/Pin';
import sampleImg from '../../assets/Swan_large_1450932169.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FlashMessage from '../../components/FlashMessage/FlashMessage';

class Home extends Component {
    state={
        loadingIcon: false,
        uploadMusic1: 'Upload file',
        uploadMusic2: 'Upload file',
        showFlashMessage: false,
        allUsers: [],
        allPins: [],
        showModal: false,
        canSaveButton: false,
        showMobileNavbar: false,
    };

    componentDidMount(){
        document.addEventListener('mousedown', this.handleOutsideClick);

        // console.log('component did mount');
        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                this.setState({ loginEmail: firebaseUser.email });
                // console.log('firebaseUser', firebaseUser);

                const user = firebase.auth().currentUser;
                // console.log('current user: ', user);
                this.loadDatabase();
            }
            else{
                const url = '/';
                window.location.href = url;
                // console.log('not logged in');
            }
        });
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleOutsideClick);
    } 

    toggleMobileNavbar = () =>{
        this.setState({
            showMobileNavbar: !this.state.showMobileNavbar
        });
    }

    handleOutsideClick = (e) =>{
        // clicked navbar?
        if(this.navbarNode.contains(e.target)){
            
        }
        else{
            this.setState({
                showMobileNavbar: false
            });
        }

    }

    loadDatabase = () =>{
        this.setState({
            loadingIcon: true
        });

        axios.get('/.json')
            .then(res=>{
                // console.log('load: ',res.data);

                // firebase won't store empty array, so create empty array here
                for(let user of res.data.allUsers){
                    if(!user.yourPins){
                        user.yourPins = [];
                    }
                    if(!user.followingPins){
                        user.followingPins = [];
                    }
                }
                // console.log('new res.data: ', res.data);
                
                this.setState({
                    allUsers: res.data.allUsers,
                    dbLoaded: true,
                    lastPinId: res.data.lastPinId,
                });

                const dataToPass = {
                    allUsers: res.data.allUsers,
                    loginEmail: this.state.loginEmail,
                }

                this.setStateAllPins(dataToPass);
            })
            .catch(err=>console.log(err));
    };

    updateDatabase = (allUsers) =>{
        // console.log('updatemethod: ', this.state.allUsers);
        // console.log('pass allusers:', allUsers);

        const data = [...this.state.allUsers];
        // console.log('here data', data);
        const lastPinId = this.state.lastPinId;
        firebase.database().ref("-KsvSXlLmZRq_i-pAUhx").set({
            allUsers: data,
            lastPinId: lastPinId,
        }).then(success =>{
            console.log('success', success);
            this.setState({
                showFlashMessage: true,
            }, () =>{
                this.hideFlshMessage();
            });
            
        }, error =>{
            console.log('error', error);
        });
    }

    hideFlshMessage = () =>{
        setTimeout(() =>{
            this.setState({
                showFlashMessage: false,
            });
        }, 5000);
    }

    setStateAllPins = () =>{
        const loginEmail = this.state.loginEmail;

        const allUsers = [...this.state.allUsers];

        // get all pins except your own and following pins
        const copyAllUsers = [...this.state.allUsers];

        const userIndex = copyAllUsers.findIndex(val=>{
            return val.email === loginEmail;
        });

        copyAllUsers.splice(userIndex, 1);

        const pinsToDisplayWithFollowingPins = [];
        for(let user of copyAllUsers){
            for(let pin of user.yourPins){
                pinsToDisplayWithFollowingPins.push(pin);
            }
        }

        // minus your following pins
        const yourFollowingPins = allUsers[userIndex].followingPins;

        const indexes = [];

        // use remove multi items from array method
        if(yourFollowingPins.length){
            for(let remVal of yourFollowingPins){
                indexes.push(pinsToDisplayWithFollowingPins.findIndex(function(val){
                    return val.pinId === remVal.pinId;
                }));
            }

            // sort indexes array
            const sortedIndexes = indexes.sort(function(a, b){ return a - b});

            for(let i=sortedIndexes.length-1; i>=0; i--){
                pinsToDisplayWithFollowingPins.splice(sortedIndexes[i], 1);
            }

            // console.log('new pinsto display: ', pinsToDisplayWithFollowingPins);
        }

        this.setState({
            allPins: pinsToDisplayWithFollowingPins,
            loadingIcon: false
        });
    }

    logOutHandler = () =>{
        // console.log('logging out');
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
            this.setState({
                imageUrl: ev.target.files[0],
                uploadMusic1: ev.target.files[0].name,
                uploadMusic2: ev.target.files[0].name,
            });
        }
    };

    

    // modal handlers----------------------------------------
    createPinHandler = (email) =>{
        if(this.state.title && this.state.imageUrl && this.state.webUrl){
            const newPin = {};
            newPin.title = this.state.title;
            newPin.imageUrl = this.state.imageUrl;
            newPin.webUrl = this.state.webUrl;

            let lastPinId = this.state.lastPinId;
            // console.log('last id: ', lastPinId);
            newPin.pinId = lastPinId+1;
            // console.log('++: ', newPin.pinId);

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
                    // console.log('url: ', url);
                    newPin.imageUrl = url;
                    // newPin.imageUrl = 'test url';

                    // console.log('email: ', email);
                    const allUsers = [...this.state.allUsers];

                    const userIndex = allUsers.findIndex(val=>{
                        return val.email === email;
                    });

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
        // console.log('url: ', webUrl);
        window.open(webUrl);
    };

    savePinHandler = (pinId) =>{
        // console.log('pinId: ', pinId);
        const allPins = [...this.state.allPins];

        const indexOfPin = allPins.findIndex(val=>{
            return val.pinId === pinId;
        });

        const loginEmail = this.state.loginEmail;
        const allUsers = [...this.state.allUsers];
        const indexOfUser = allUsers.findIndex(val=>{
            return val.email === loginEmail;
        });

        allUsers[indexOfUser].followingPins.push(allPins[indexOfPin]);

        this.setState({
            allUsers: allUsers
        });

        this.updateDatabase();

        this.setStateAllPins();
    };

    modalOutsideClickedHandler = (ev)=>{
        if(ev.target.className === 'Modal'){
            this.setState({
                showModal: false
            });
        }
    }

    render(){
        let loading = null;
        if(this.state.loadingIcon){
            loading = <div className='loading'>
                    <FontAwesomeIcon
                        icon={faSpinner}
                        color='#4f4f4f'
                        size='6x'
                        spin/>
                </div>
        }

        let pins = null;
        if(this.state.dbLoaded){
            // console.log("===============================",this.state);
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

                {loading}

                <FlashMessage
                    message='Saved successfully.'
                    showFlashMessage={this.state.showFlashMessage}
                />

                <div ref={node => {this.navbarNode = node;}}>
                    <Navbar
                        showMobileNavbar={this.state.showMobileNavbar}
                        clicked={this.toggleMobileNavbar}
                        showModalClicked={this.showModal}
                        logOutClicked={this.logOutHandler}
                        canCreateNewPin={true}
                    />
                </div>

                <Modal
                    title='Create your pin'
                    onSaveBtnClicked={this.createPinHandler.bind(this, this.state.loginEmail)}
                    onCloseBtnClicked={this.closeModalHandler}
                    showModal={this.state.showModal}
                    canSaveButton={this.state.canSaveButton}
                    passRef={node => {this.navbarNode = node;}}
                    modalOutsideClicked={this.modalOutsideClickedHandler}
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
                        {/* <Input
                            inputtype='input'
                            type='file'
                            label='upload file'
                            onChange={(ev)=>this.inputTextHandler(ev, 'file')}/> */}
                        <Input2
                            inputtype='input'
                            type='file'
                            name='uploadMusic'
                            id='uploadMuisc'
                            // onChange={this.uploadMusicHandler}
                            onChange={(ev)=>this.inputTextHandler(ev, 'file')}
                            filelabelspan={this.state.uploadMusic1}
                            filelabel={this.state.uploadMusic2}/>

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