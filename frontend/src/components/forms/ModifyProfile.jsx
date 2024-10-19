import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";
import DynamicForm from "./DynamicForm";

const ModifyProfile = ({ userId, onAdd }) => {
  const [selectedProfileType, setSelectedProfileType] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      let response;
      switch (selectedProfileType.value) {
        case "employee":
          response = await api.post("/api/employees/", {
            user: userId,
            hourly_rate: parseFloat(formData.hourlyRate),
            phone_number: formData.phoneNumber,
          });
          break;
        case "client":
          response = await api.post("/api/clients/", {
            user: userId,
            phone_number: formData.phoneNumber,
          });
          break;
        default:
          throw new Error("Unsupported profile type");
      }

      if (response.status === 200 || response.status === 201) {
        onAdd();
      } else {
        alert(`Failed to add profile. STATUS: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding profile:", error);
      alert("Error adding profile. Check console for details.");
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
          <DynamicForm
            type={selectedProfileType.value}
            onSubmit={handleSubmit}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ModifyProfile;
