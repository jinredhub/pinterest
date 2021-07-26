import React, {Component} from 'react';
import './Signup.css';
import firebase from 'firebase';
// import {database} from '../../firebase';
import axios from '../../axios';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

class SignUp extends Component {
    state = {
        errorMessage: '',
        firstNameText: '',
        lastNameText: '',
        emailText: '',
        allUsers: [],
        passwordText: ''
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(firebaseUser=>{
            if(firebaseUser){
                // console.log(firebaseUser);
                const url = '/home';
                window.location.href = url;
            }
            else{
                // console.log('not looged in');
                this.loadDatabase();
            }
        })
    }

    loadDatabase = () =>{
        // console.log('load db method');
        axios.get('/.json')
            .then(res=>{
                // console.log('load: ',res.data);
                if(res.data.allUsers && res.data.allUsers.length){
                    // console.log('yes length');
                    this.setState({
                        allUsers: res.data.allUsers,
                        lastPinId: res.data.lastPinId,
                        dbLoaded: true,
                    });
                }
                else{
                    // console.log('no length');
                    this.setState({
                        allUsers: [],
                        lastPinId: res.data.lastPinId,
                        dbLoaded: true,
                    });
                }
            })
            .catch(err=>console.log(err));
    }

    inputTextHandler = (ev, type) =>{
        if(type === 'email'){
            this.setState({
                emailText: ev.target.value
            });
        }
        else if(type==='firstName'){
            this.setState({
                firstNameText: ev.target.value
            });
        }
        else if(type==='lastName'){
            this.setState({
                lastNameText: ev.target.value
            });
        }
        else if(type==='password'){
            this.setState({
                passwordText: ev.target.value
            });
        }
    };

    updateDatabase = (email, firstName, lastName, lastPinId, password) =>{
        const allUsers = [...this.state.allUsers];

        allUsers.push({
            firstName: firstName,
            lastName: lastName,
            email: email,
            yourPins: [],
            followingPins: [],
        });

        // database.ref may not work in localhost
        firebase.database.ref("-KsvSXlLmZRq_i-pAUhx/").set({
            allUsers: allUsers,
            lastPinId: lastPinId,
        }).then((snap) =>{
            // console.log('snap: ', snap);

            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(email, password);
            promise.then((userCredential) =>{
                // console.log('userCredential', userCredential);
            })
            .catch(e=>{
                console.log(e.message);
                this.setState({errorMessage: e.message});
            });
        }).catch(err =>{
            console.log('err: ', err);
        });
    }

    formSignupHandler = () =>{
        const email = this.state.emailText;
        const password = this.state.passwordText;
        const firstName = this.state.firstNameText;
        const lastName = this.state.lastNameText;
        const lastPinId = this.state.lastPinId;

        if(firstName && lastName){
            this.updateDatabase(email, firstName, lastName, lastPinId, password);
        }
        else{
            const message = 'Please fill out all fields.';
            this.setState({
                errorMessage: message
            });
        }
    }

    handleKeyPress = (ev) =>{
        if(ev.key === 'Enter'){
            this.formSignupHandler();
        }
    }

    render(){
        let errorMessage = null;
        let form = null;
        if(this.state.dbLoaded){

            if(this.state.errorMessage){
                errorMessage = <p className='errorText'>{this.state.errorMessage}</p>;
            }
            form = <form>
                <Input
                    inputtype='input'
                    type='text'
                    label='Email'
                    onChange={(ev)=>this.inputTextHandler(ev, 'email')}
                    onKeyPress={this.handleKeyPress}
                    autoComplete='on'    
                />
                <Input
                    inputtype='input'
                    type='text'
                    label='First name'
                    onChange={(ev)=>this.inputTextHandler(ev, 'firstName')}
                    onKeyPress={this.handleKeyPress}
                    autoComplete='on'    
                />
                <Input
                    inputtype='input'
                    type='text'
                    label='Last name'
                    onChange={(ev)=>this.inputTextHandler(ev, 'lastName')}
                    onKeyPress={this.handleKeyPress}
                    autoComplete='on'    
                />
                <Input
                    inputtype='input'
                    type='password'
                    label='Password'
                    onChange={(ev)=>this.inputTextHandler(ev, 'password')}
                    onKeyPress={this.handleKeyPress}
                    autoComplete='off'    
                />
                {errorMessage}
                <div className='buttonContainer'>
                    <Button
                        onClick={()=>this.formSignupHandler()}
                        type='button'
                        color='primary'
                    >Sign Up</Button>
                </div>
            </form>;
        }

        return (
            <div className='Signup'>
                {form}
            </div>
        )
    }
}

export default SignUp;