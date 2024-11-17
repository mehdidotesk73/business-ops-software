import { useState, useEffect, cloneElement, useContext } from "react";
import UserContext from "../components/userContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ElementViewCard from "../components/cards/ElementViewCard";
import ModifyModal from "../components/modals/ModifyModal";

function AccountPage() {
  const [user, setUser] = useState(null);
  const { auth } = useContext(UserContext);
  const { userId, authenticate } = auth;
  const navigate = useNavigate;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get(`/api/users/${userId}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setUser(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateUser = async (formData) => {
    const { username, password, firstName, lastName, email } = formData;
    const payload = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      email: email,
    };
    try {
      await api.patch(`/api/user/${userId}/`, payload);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user.");
    } finally {
      authenticate({ username: username, password: password });
      getUser();
    }
  };

  if (user) {
    console.log(user);
    return (
      <div>
        <ElementViewCard type='user' element={user} />
        <ModifyModal
          onSubmit={updateUser}
          method='edit'
          type='user'
          element={user}
        />
      </div>
    );
  }
}

export default AccountPage;
