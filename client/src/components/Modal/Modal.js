import React from 'react';
import './Modal.css';

import Button from '../Button/Button';

const modal = (props) =>{

    // console.log('props: ', props);
    if(!props.showModal){
        return null;
    }
    console.log('canSavebutton: ', props.canSaveButton);
    console.log('showmodal: ', props.showModal);

    return (
        <div className='Modal' onClick={(ev)=>props.modalOutsideClicked(ev)}>
            <div className='container'>
                <span onClick={props.onCloseBtnClicked} className='close'>&times;</span>
                <div className='header'>
                    {props.title}
                </div>

                <div className="body">
                    {props.children}
                </div>

                <div className='footer'>
                    <Button
                        color='primary'
                        type='button'
                        onClick={props.onSaveBtnClicked}
                        disabled={props.canSaveButton}
                    >Create</Button>
                </div>
            </div>
        </div>
    )
}

export default modal;