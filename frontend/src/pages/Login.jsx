import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/userContext";
import DynamicForm from "../components/forms/DynamicForm";
import LoadingIndicator from "../components/LoadingIndicator";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useContext(UserContext);
  const { authenticate } = auth;

  const handleSubmit = async (formData) => {
    setLoading(true);
    const { userName, password } = formData;

    try {
      const credentials = { username: userName, password: password };
      await authenticate(credentials);
      navigate("/");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DynamicForm type={"login"} onSubmit={handleSubmit} />
      {loading && <LoadingIndicator />}
    </div>
  );
}

export default Login;
