import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";

const AssignProject = ({ projectId, onSubmit }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch existing materials
    api
      .get("/api/employees/")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSubmit = () => {
    console.log(selectedUser.value);
    if (selectedUser) {
      api
        .post(`api/projects/${projectId}/assign-coordinator/`, {
          coordinator: selectedUser.value,
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201);
          else
            alert(`Failed to assign coordinator. STATUS: ${response.status}`);
          onSubmit(response.data);
          setSelectedUser(null);
        })
        .catch((error) => console.error("Error assigning coordinator:", error));
    } else {
      alert("Please select an employee to assign as coordinator");
    }
  };

  employees.map((employee) => console.log(employee));

  return (
    <div>
      <div className='form-group'>
        <Select
          options={employees.map((employee) => ({
            value: employee.user.id,
            label: employee.user.name,
          }))}
          value={selectedUser}
          onChange={(selectedOption) => setSelectedUser(selectedOption)}
          placeholder='Select user...'
        />
      </div>
      <br />
      <button
        type='button'
        className='btn btn-success btn-sm ms-2'
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default AssignProject;
