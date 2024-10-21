import { useState, useEffect, cloneElement } from "react";
import { MainAccountView } from "../components/cards/CustomElementViews";

function AccountPage() {
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/api/users/");
      const camelCaseData = keysToCamelCase(res.data);
      setUsers(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
}

export default AccountPage;
