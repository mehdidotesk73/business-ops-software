import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";

const AssignProject = ({ projectId, onAdd }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch existing materials
    api
      .get("/api/users/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleAdd = () => {
    if (selectedUser && quantity) {
      api
        .post("/api/project-materials/", {
          project: projectId,
          material: selectedUser.value,
          quantity: parseFloat(quantity),
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201);
          else alert(`Failed to add material. STATUS: ${response.status}`);
          onAdd(response.data);
          setSelectedUser(null);
          setQuantity("");
        })
        .catch((error) => console.error("Error adding material:", error));
    } else {
      alert("Please select a material and enter a quantity");
    }
  };

  return (
    <div>
      <div className='form-group'>
        <Select
          options={users.map((material) => ({
            value: material.id,
            label: material.name,
          }))}
          value={selectedUser}
          onChange={(selectedOption) => setSelectedUser(selectedOption)}
          placeholder='Select material...'
        />
      </div>
      <div className='form-group'>
        <input
          type='number'
          className='form-control'
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder='Enter quantity'
        />
      </div>
      <br />
      <button
        type='button'
        className='btn btn-success btn-sm ms-2'
        onClick={handleAdd}
      >
        Submit
      </button>
    </div>
  );
};

export default AssignProject;
