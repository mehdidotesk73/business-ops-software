import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Alert.css";

const Alert = ({ message, duration }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  return (
    <div
      className={`alert alert-secondary alert-container ${
        !isVisible ? "fade-out" : ""
      }`}
      role='alert'
    >
      {message}
    </div>
  );
};

export default Alert;
