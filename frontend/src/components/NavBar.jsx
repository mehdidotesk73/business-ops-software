import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import UserContext from "./userContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark ps-3 pe-3'>
      <Link className='navbar-brand' to='/'>
        Friends Electric
      </Link>

      <button
        className='navbar-toggler'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#navbarNavDropdown'
        aria-controls='navbarNavDropdown'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarNavDropdown'>
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
            <Link className='nav-link' to='/users'>
              User Management
            </Link>
          </li>
        </ul>
        <ul className='navbar-nav'>
          {user ? (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/'>
                  Welcome {user}
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
