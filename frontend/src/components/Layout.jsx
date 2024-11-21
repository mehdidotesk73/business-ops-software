import React from "react";
import Navbar from "./NavBar";
import styles from "../styles/Base.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.darkTheme}>
      <Navbar />
      <div className='p-3' background-color='#121212' color='#ffffff'>
        {children}
      </div>
    </div>
  );
};

export default Layout;
