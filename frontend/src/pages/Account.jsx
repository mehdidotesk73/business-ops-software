import { useState, useEffect, cloneElement, useContext } from "react";
import { MainAccountView } from "../components/cards/CustomElementViews";
import UserContext from "../components/userContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";

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
      const res = await api.get(`/api/user/${userId}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setUser(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (user) {
    return <div>{user.username}</div>;
  }
}

export default AccountPage;
