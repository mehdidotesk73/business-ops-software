import UserForm from "../components/forms/UserForm";

function Register() {
  return <UserForm route='/api/user/register/' method='register' />;
}

export default Register;
