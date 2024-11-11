import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";

const DeleteProfile = ({ userId, onAdd }) => {
  const [selectedProfileType, setSelectedProfileType] = useState(null);

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      if (selectedProfileType.value === "employee") {
        await api.delete(`/api/employees/by-user/?user_id=${userId}`);
      } else if (selectedProfileType.value === "client") {
        await api.delete(`/api/clients/by-user/?user_id=${userId}`);
      }
      onAdd();
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert(`Failed to delete ${selectedProfileType.value} profile.`);
    }
  };

  const profileOptions = [
    {
      value: "employee",
      label: "Employee",
    },
    {
      value: "client",
      label: "Client",
    },
  ];

  return (
    <div>
      <div className='form-group'>
        <Select
          options={profileOptions}
          value={selectedProfileType}
          onChange={(selectedOption) => setSelectedProfileType(selectedOption)}
          placeholder='Select profile type...'
        />
      </div>
      <div className='form-group'>
        {selectedProfileType ? (
          <form onSubmit={handleDelete}>
            <input type='submit' value='Submit' />
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default DeleteProfile;
