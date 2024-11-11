import { useState, useContext } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
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
  const { setUser } = useContext(UserContext);

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      if (method === "login") {
        console.log(res.data);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        setUser(username);
        navigate("/");
      } else {
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
      {method === "register" ? (
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
      ) : null}

      {loading && <LoadingIndicator />}
      <button className='form-button' type='submit'>
        {name}
      </button>
    </form>
  );
}

export default UserForm;
