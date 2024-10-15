import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { LOGIN_STATUS } from "../constants";

const Navbar = () => {
  const username = "";

  return (
    <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
      <Link className='navbar-brand ms-3' to='/'>
        Friends Electric
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNav'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item active'>
            <Link className='nav-link' to='/'>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/materials'>
              Materials
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/tasks'>
              Tasks
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/projects'>
              Projects
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/*'>
              User Management
            </Link>
          </li>
        </ul>
        <ul className='navbar-nav'>
          {localStorage.getItem(LOGIN_STATUS) === "true" ? (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/'>
                  Welcome {username}
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/logout'>
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/login'>
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/register'>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
