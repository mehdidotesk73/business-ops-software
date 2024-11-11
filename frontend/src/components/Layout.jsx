import React from "react";
import Navbar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='p-3' background-color='#121212' color='#ffffff'>
        {children}
      </div>
    </div>
  );
};

export default Layout;
