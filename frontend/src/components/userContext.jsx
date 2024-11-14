import React, { createContext, useState } from "react";
import useAuth from "./useAuth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <UserContext.Provider value={{ auth }}>{children}</UserContext.Provider>
  );
};

export default UserContext;
