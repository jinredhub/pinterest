import React, {Component} from 'react';
import './Login.css';
import * as firebase from 'firebase';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

class Login extends Component{
    state={
        errorMessage: '',
        emailText: '',
        passwordText: ''
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                console.log(firebaseUser);
                const url = '/home';
                window.location.href = url;
            }
            else{
                console.log('not logged in');
            }
        });
    }

    inputTextHandler = (ev, type) =>{
        if(type === 'email'){
            this.setState({ emailText: ev.target.value});
        }
        else {
            this.setState({ passwordText: ev.target.value});
        }
    };

    handlerKeyPress = (ev) =>{
        if(ev.key === 'Enter'){
            this.formLoginHandler();
        }
    }

    formLoginHandler = () =>{
        const email = this.state.emailText;
        const password = this.state.passwordText;
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e=>{
            console.log(e.message);
            this.setState({errorMessage: e.message});
        });
    }

    render(){
        let errorMessage = '';
        if(this.state.errorMessage){
            errorMessage = <p className='errorText'>{this.state.errorMessage}</p>;
        }

        const form = <form>
            <Input
                inputtype='input'
                type='text'
                label='Email'
                onChange={(ev)=>this.inputTextHandler(ev, 'email')}
                onKeyPress={this.handleKeyPress}
            />
            <Input
                inputtype='input'
                type='password'
                label='Password'
                onChange={(ev)=>this.inputTextHandler(ev, 'password')}
                onKeyPress={this.handlerKeyPress}
            />
            {errorMessage}
            <div className='buttonContainer'>
                <Button color='primary' onClick={()=>this.formLoginHandler()} type='button'>Log In</Button>
                <div>or</div>
                <strong><a href="/signup">Sing Up</a></strong>
            </div>
        </form>

        return (
            <div className='Login'>
                {form}
            </div>
        )
    }
}

export default Login;