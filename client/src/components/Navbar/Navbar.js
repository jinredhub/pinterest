// import React from 'react';
// import './Navbar.css';

// const navbar = (props) =>{
//     return (
//         <div className='Navbar'>
//             {props.children}
//         </div>
//     )
// }

// export default navbar;


import React from 'react';
import './Navbar.css';
import jinLogo from '../../assets/logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';


const navbar = (props) =>{

    let mobileNavbarStyle = {
        display: 'none'
    }
    if(props.showMobileNavbar){
        mobileNavbarStyle.display = 'block'
    }

    // render create pin button?
    let createPinButton = null;
    if(props.canCreateNewPin){
        createPinButton = <button className='createPinButton' onClick={props.showModalClicked}>create pin</button>;
    }

    return (
        <div className='Navbar'>
            {/* desktop nav menu */}
            <div className='nav desktopNavContainer disp-flex align-items--center hide-tablet justify-content--spaceBetween'>
                <img src={jinLogo} alt="logo" style={{width:100+'px'}}/>
            <div>
                <a href="/home">Home</a>
                <a href="/pins">your pins</a>
                <a href="/following">Saved pins</a>
                <a href='#' onClick={(ev)=>props.logOutClicked(ev)}>Log out</a>
                {createPinButton}
            </div>

            </div>

            {/* mobile nav menu */}
            <div className='nav mobileNavContainer disp-flex align-items--center show-tablet-flex justify-content--end'>
                <div className="myNavLinks" style={mobileNavbarStyle}>
                    <a href="/home">Home</a>
                    <a href="/pins">your pins</a>
                    <a href="/following">Saved pins</a>
                    <a href='#' onClick={(ev)=>props.logOutClicked(ev)}>Log out</a>
                    {createPinButton}
                </div>
                <a onClick={props.clicked} href="#" className='navHamburgerIcon' aria-label="click to open mobile navigation menu">
                    <FontAwesomeIcon
                        icon={faBars}
                        color='black'
                        size='1x'/>
                </a>
            </div>
        </div>
    )
}

export default navbar;