import { useState, useContext } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.css";
import LoadingIndicator from "../LoadingIndicator";
import UserContext from "../userContext";

function UserForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useContext(UserContext);
  const { authenticate } = auth;

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const credentials = { username, password };
      if (method === "login") {
        await authenticate(credentials);
        navigate("/");
      } else {
        console.log(route);
        await api.post(route, {
          username,
          password,
          first_name: firstName,
          last_name: lastName,
          email,
        });
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form-container'>
      <h1>{name}</h1>
      <input
        className='form-input'
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Username'
      />
      <input
        className='form-input'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
      {method === "register" && (
        <>
          <input
            className='form-input'
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
          />
          <input
            className='form-input'
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
          />
          <input
            className='form-input'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email address'
          />
        </>
      )}
      {loading && <LoadingIndicator />}
      <button className='form-button' type='submit'>
        {name}
      </button>
    </form>
  );
}

export default UserForm;
