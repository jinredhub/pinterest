import React from 'react';
import './Pin.css';
import Button from '../Button/Button';

const pin = (props) =>{

    const style = {
        // backgroundImage: `url(${props.imageUrl})`,
    }

    // check if we need button
    let button = '';
    if(props.onPinSaveButtonClicked){
        button = <Button onClick={props.onPinSaveButtonClicked} className='btn btn-danger'>Save</Button>;
    }

    // truncate webUrl
    let webUrl = '';
    if(props.webUrl){
        if(props.webUrl.length > 20){
            webUrl = props.webUrl.substring(0, 20)+'...';
        }
        else{
            webUrl = props.webUrl;
        }
    }

    return(
        <div className='Pin' style={style}>
            <img src={props.imageUrl} alt="image"/>
            {button}
            <span onClick={props.onWebUrlClicked} className="caption">&nbsp;{webUrl}&nbsp;</span>
        </div>
    )
}

export default pin;