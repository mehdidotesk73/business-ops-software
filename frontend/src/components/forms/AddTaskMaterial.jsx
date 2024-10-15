import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";

const AddTaskMaterial = ({ taskId, onAdd }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    // Fetch existing materials
    api
      .get("/api/materials/")
      .then((response) => setMaterials(response.data))
      .catch((error) => console.error("Error fetching materials:", error));
  }, []);

  const handleAdd = () => {
    if (selectedMaterial && quantity) {
      console.log({
        task: taskId,
        material: selectedMaterial.value,
        quantity: parseFloat(quantity),
      });
      api
        .post("/api/task-materials/", {
          task: taskId,
          material: selectedMaterial.value,
          quantity: parseFloat(quantity),
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201);
          else alert(`Failed to add task-material. STATUS: ${response.status}`);
          onAdd(response.data);
          setSelectedMaterial(null);
          setQuantity("");
        })
        .catch((error) => console.error("Error adding task material:", error));
    } else {
      alert("Please select a material and enter a quantity");
    }
  };

  return (
    <div>
      <div className='form-group'>
        <Select
          options={materials.map((material) => ({
            value: material.id,
            label: material.name,
          }))}
          value={selectedMaterial}
          onChange={(selectedOption) => setSelectedMaterial(selectedOption)}
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

export default AddTaskMaterial;
