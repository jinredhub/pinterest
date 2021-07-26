import React from 'react';
import './Navbar.css';
import jinLogo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
                <Link className='navLink' to="/home">Home</Link>
                <Link className='navLink' to="/pins">your pins</Link>
                <Link className='navLink' to="/following">Saved pins</Link>
                <button className='navLink' type='button' onClick={(ev)=>props.logOutClicked(ev)}>Log out</button>
                {createPinButton}
            </div>

            </div>

            {/* mobile nav menu */}
            <div className='nav mobileNavContainer disp-flex align-items--center show-tablet-flex justify-content--end'>
                <div className="myNavLinks" style={mobileNavbarStyle}>
                    <Link className='navLink' to="/home">Home</Link>
                    <Link className='navLink' to="/pins">your pins</Link>
                    <Link className='navLink' to="/following">Saved pins</Link>
                    <button className='navLink' type='button' onClick={(ev)=>props.logOutClicked(ev)}>Log out</button>
                    {createPinButton}
                </div>
                <button type='button' onClick={props.clicked} className='navHamburgerIcon' aria-label="click to open mobile navigation menu">
                    <FontAwesomeIcon
                        icon={faBars}
                        color='black'
                        size='1x'/>
                </button>
            </div>
        </div>
    )
}

export default navbar;