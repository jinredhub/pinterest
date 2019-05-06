import React, {Component} from 'react';
import './Login.css';
import * as firebase from 'firebase';

import Input2 from '../../components/Input2/Input2';
import Button from '../../components/Button/Button';

class Login extends Component{
    state={
        errorMessage: '',
        data : {
            emailText : "",
            passwordText: "",
        }
        // emailText: '',
        // passwordText: ''
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

        const data = {
            emailText: "demo@demo.com",
            passwordText: "password"
        }

        this.setState({
            data: data
        });
    }

    // inputTextHandler = (ev, type) =>{
    //     if(type === 'email'){
    //         this.setState({ emailText: ev.target.value});
    //     }
    //     else {
    //         this.setState({ passwordText: ev.target.value});
    //     }
    // };

    inputHandler = (ev) =>{
        console.log('type: ', ev.target.type);
        if(ev.target.type && ev.target.type === 'file'){
            // display file name when file was selected
            const label = ev.target.nextElementSibling;
            const labelVal = label.innerHTML;

            let fileName = '';
            if(ev.target.files && ev.target.files.length > 1){
                fileName = (ev.target.getAttribute('data-multiple.caption') || '').replace('{count}', ev.target.files.length);
            }
            else{
                fileName = ev.target.value.split('\\').pop();
            }

            if(fileName){
                const span = ev.target.name +1;
                console.log('span state: ', span);
                this.setState({ [span]: fileName });
            }
            else{
                const label = ev.target.name +2;
                this.setState({[label]:labelVal});
            }

            // cannot upload file because of 'fakepath'
            // console.log('target vleu: ', ev.target.value);

            // code to save file (see insurance_form.blade.php)
            // todo: save file using formData

        }
        else if(ev.target.type && ev.target.type === 'checkbox'){
            console.log('chiecked? ', ev.target.checked);
            if(ev.target.checked){
                const data = {...this.state.data};
                data[ev.target.name] = ev.target.value;
                this.setState({ data : data });
            }
            else{
                const data = {...this.state.data};
                data[ev.target.name] = '';
                this.setState({ data: data});
            }
        }
        else{
            const data = {...this.state.data};
            data[ev.target.name] = ev.target.value;
            this.setState({ data: data });
        }
        // console.log('state: ', this.state);
        // console.log('value: ', ev.target.value);
        // console.log('check: ', ev.target.checked);
    }

    handlerKeyPress = (ev) =>{
        if(ev.key === 'Enter'){
            this.formLoginHandler();
        }
    }

    formLoginHandler = () =>{
        const email = this.state.data.emailText;
        const password = this.state.data.passwordText;
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
            <Input2
                inputtype='input'
                type='text'
                label='Email'
                value={this.state.data.emailText}
                name="emailText"
                id="emailText"
                onChange={this.inputHandler}
                onKeyPress={this.handleKeyPress}
                autoFocus
            />
            <Input2
                inputtype='input'
                type='password'
                label='Password'
                value={this.state.data.passwordText}
                name="passwordText"
                id="passwordText"
                onChange={this.inputHandler}
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
                <h1>Login or Create Account</h1>
                {form}
            </div>
        )
    }
}

export default Login;