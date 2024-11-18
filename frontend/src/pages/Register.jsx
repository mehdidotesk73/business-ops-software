import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../components/forms/DynamicForm";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    console.log(formData);
    const { username, password, firstName, lastName, email } = formData;

    try {
      await api.post("/api/user/register/", {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      navigate("/login");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DynamicForm type={"register"} onSubmit={handleSubmit} />
      {loading && <LoadingIndicator />}
    </div>
  );
}

export default Register;
