import { useState, useEffect, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ViewModal from "../components/modals/ViewModal";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";
import ProfileModal from "../components/modals/ProfileModal";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await api.get("/api/users/");
      const camelCaseData = keysToCamelCase(res.data);
      setUsers(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = (element) => {
    api
      .delete(`/api/users/${element.id}/`)
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete user.");
        getUsers();
      })
      .catch((error) => alert(error));
  };

  const inspectUser = (element) => {
    navigate(`/users/${element.id}`);
  };

  const viewModal = cloneElement(
    <ViewModal type='user' buttonClassName='btn btn-info btn-sm' />,
    { element: null }
  );

  const actions = [{ label: "View", action: viewModal }];

  return (
    <div>
      <div>
        <h2>Users</h2>
        {users.length > 0 && (
          <ElementTable
            tableKey='user'
            elements={users}
            actions={actions}
          ></ElementTable>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
