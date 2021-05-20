import React, {Component} from 'react';

import './Pin.css';
import Button from '../Button/Button';
import placeholderImage from '../../assets/placeholderImage.jpg';


// const pin = (props) =>{

//     const style = {
//         // backgroundImage: `url(${props.imageUrl})`,
//     }

//     // check if we need button
//     let button = '';
//     if(props.onPinSaveButtonClicked){
//         button = <Button onClick={props.onPinSaveButtonClicked} className='btn btn-danger'>Save</Button>;
//     }

//     // truncate webUrl
//     let webUrl = '';
//     if(props.webUrl){
//         if(props.webUrl.length > 20){
//             webUrl = props.webUrl.substring(0, 20)+'...';
//         }
//         else{
//             webUrl = props.webUrl;
//         }
//     }
    

//     return(
//         <div className='Pin' style={style}>
//             <div className='placeholderPin'></div>
//             <img src={props.imageUrl} alt="image"/>
//             {button}
//             <span onClick={props.onWebUrlClicked} className="caption">&nbsp;{webUrl}&nbsp;</span>
//         </div>
//     )
// }

// export default pin;


class Pin extends Component{
    // state={
        
    // }
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
            placeholderImg = <img src={placeholderImage}/>;
            // make real image opacity 0 till it finish loading
            opacity = {opacity: 0};
        }
       
        return (
            <div className='Pin'>
                {placeholderImg}
                
                <img src={this.props.imageUrl} alt="image" onLoad={()=>{this.setState({imageLoaded: true})}} style={opacity}/>
                {button}
                {removeButton}
                {/* <span onClick={this.props.onWebUrlClicked} className="caption">&nbsp;{webUrl}&nbsp;</span> */}
            </div>
        )
    }
}

export default Pin;