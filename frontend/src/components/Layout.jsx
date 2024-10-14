import React from "react";
import Navbar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='p-3'>{children}</div>
    </div>
  );
};

export default Layout;
