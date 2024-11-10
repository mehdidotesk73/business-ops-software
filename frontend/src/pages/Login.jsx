import { useContext } from "react";
import UserForm from "../components/forms/UserForm";
import UserContext from "../components/userContext";

function Login() {
  const { setUser } = useContext(UserContext);

  console.log("Test in login");

  const handleLogin = (userData) => {
    setUser(userData);
    // Additional login logic
  };

  return <UserForm route='/api/token/' method='login' />;
}

export default Login;
