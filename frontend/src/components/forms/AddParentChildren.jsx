import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";

const AddParentChildren = ({ parentType, parentId, childType, onAdd }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    // Fetch existing materials
    switch (childType) {
      case "material":
        api
          .get("/api/materials/")
          .then((response) => setChildren(response.data))
          .catch((error) => console.error(`Error fetching materials:`, error));
        break;
      case "task":
        api
          .get("/api/tasks/")
          .then((response) => setChildren(response.data))
          .catch((error) => console.error(`Error fetching tasks:`, error));
        break;
    }
  }, []);

  const handleAdd = () => {
    const payload = {};
    payload[parentType] = parentId;
    payload[childType] = selectedChild.value;
    payload["quantity"] = parseFloat(quantity);

    // const payload = {
    //   parentType: parentId,
    //   childType: selectedChild.value,
    //   quantity: parseFloat(quantity),
    // };
    if (selectedChild && quantity) {
      console.log(payload);
      const relation = `${parentType}-${childType}`;
      const apiURL = `api/${parentType}-${childType}s/`;
      console.log(apiURL);
      console.log(payload);
      api
        .post(apiURL, payload)
        .then((response) => {
          if (response.status === 200 || response.status === 201);
          else alert(`Failed to add ${relation}. STATUS: ${response.status}`);
          onAdd(response.data);
          setSelectedChild(null);
          setQuantity("");
        })
        .catch((error) => console.error(`Error adding ${relation}:`, error));
    } else {
      alert(`Please select a ${childType} and enter a quantity`);
    }
  };

  return (
    <div>
      <div className='form-group'>
        <Select
          options={children.map((child) => ({
            value: child.id,
            label: child.name,
          }))}
          value={selectedChild}
          onChange={(selectedOption) => setSelectedChild(selectedOption)}
          placeholder={`Select ${childType}...`}
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

export default AddParentChildren;
