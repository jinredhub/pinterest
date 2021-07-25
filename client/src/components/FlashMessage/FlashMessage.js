import React from 'react';
import './FlashMessage.css';

const flashMessage = (props) =>{
    return (
        <div className='FlashMessage' style={{display: props.showFlashMessage ? 'block' : 'none'}}>
            {props.message}
        </div>
    )
}

export default flashMessage;