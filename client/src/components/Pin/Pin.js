import React, {Component} from 'react';

import './Pin.css';
import Button from '../Button/Button';
import placeholderImage from '../../assets/placeholderImage.jpg';
import LazyLoad from "react-lazyload";

class Pin extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageLoaded: false
        }        
    }

    render(){
        // console.log('======================', this.state)

        // check if we need button
        let button = '';
        if(this.props.onPinSaveButtonClicked){
            button = <Button onClick={this.props.onPinSaveButtonClicked} className='btn btn-danger'>Save</Button>;
        }

        let removeButton = '';
        if(this.props.onPinRemoveButtonClicked){
            removeButton = <Button onClick={this.props.onPinRemoveButtonClicked} className='btn btn-danger'>Remove</Button>;
        }

        // truncate webUrl
        let webUrl = '';
        if(this.props.webUrl){
            if(this.props.webUrl.length > 20){
                webUrl = this.props.webUrl.substring(0, 20)+'...';
            }
            else{
                webUrl = this.props.webUrl;
            }
        }

        // use placeholder image till real image load.
        let placeholderImg = null;
        let opacity = {opacity: 1};
        if(!this.state.imageLoaded){
            placeholderImg = <img alt='placeholder' src={placeholderImage}/>;
            // make real image opacity 0 till it finish loading
            opacity = {opacity: 0};
        }
       
        return (
            <div className='Pin'>
                {placeholderImg}
                
                <LazyLoad height={254} offset={200}>
                    <img src={this.props.imageUrl} alt="pinned" onLoad={()=>{this.setState({imageLoaded: true})}} style={opacity}/>
                </LazyLoad>
                {button}
                {removeButton}
                {/* <span onClick={this.props.onWebUrlClicked} className="caption">&nbsp;{webUrl}&nbsp;</span> */}
            </div>
        )
    }
}

export default Pin;