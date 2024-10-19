import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { LOGIN_STATUS } from "../constants";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = ""; // Fetch the username if available.

  useEffect(() => {
    const status = localStorage.getItem(LOGIN_STATUS);
    setIsLoggedIn(status === "true");
  }, []);

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
          {isLoggedIn ? (
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
