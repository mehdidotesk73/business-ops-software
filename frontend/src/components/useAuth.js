import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN, USERNAME } from "../constants";

const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const username = localStorage.getItem(USERNAME);
    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setUserId(decoded.user_id);
        setUsername(username);
      } else {
        refreshToken();
      }
    }
  }, []);

  const authenticate = async (credentials) => {
    try {
      const res = await api.post("/api/token/", credentials);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      localStorage.setItem(USERNAME, credentials.username);
      const decoded = jwtDecode(res.data.access);
      setUserId(decoded.user_id);
      setUsername(credentials.username);
    } catch (error) {
      if (error.status === 401) {
        console.error("Authentication failed:", error);
        alert(
          "We could not verify your username and password. Please try again."
        );
      } else {
        console.error("Authentication failed:", error);
        alert(
          "Authentication failed. Please try again or register if you do not have an account."
        );
      }
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    // localStorage.setItem(ACCESS_TOKEN, "access");
    // localStorage.setItem(REFRESH_TOKEN, "refresh");
    localStorage.removeItem(USERNAME);
    setUserId(null);
    setUsername(null);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      const decoded = jwtDecode(res.data.access);
      setUserId(decoded.user_id);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  return {
    userId,
    username,
    authenticate,
    logout,
    refreshToken,
  };
};

export default useAuth;
