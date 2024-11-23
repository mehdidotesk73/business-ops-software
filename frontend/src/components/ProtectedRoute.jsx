import { Navigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import UserContext from "./userContext";
import LoadingIndicator from "./LoadingIndicator";

function ProtectedRoute({ children }) {
  const { auth } = useContext(UserContext); // Destructure auth from UserContext
  const { userId, refreshToken } = auth; // Destructure user and refreshToken from auth
  const [isLoading, setIsLoading] = useState(!userId);
  console.log("is loading", isLoading);

  useEffect(() => {
    refreshToken().then(() => setIsLoading(false));
  }, [refreshToken]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return userId ? children : <Navigate to='/login' />;
}

export default ProtectedRoute;
