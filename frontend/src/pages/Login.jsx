import UserForm from "../components/forms/UserForm";

function Login() {
  return <UserForm route='/api/token/' method='login' />;
}

export default Login;
