import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";

const AddProjectTask = ({ projectId, onAdd }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    // Fetch existing materials
    api
      .get("/api/tasks/")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleAdd = () => {
    if (selectedTask && quantity) {
      api
        .post("/api/project-tasks/", {
          project: projectId,
          task: selectedTask.value,
          quantity: parseFloat(quantity),
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201);
          else alert(`Failed to add material. STATUS: ${response.status}`);
          onAdd(response.data);
          setSelectedTask(null);
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
          options={tasks.map((task) => ({
            value: task.id,
            label: task.name,
          }))}
          value={selectedTask}
          onChange={(selectedOption) => setSelectedTask(selectedOption)}
          placeholder='Select task...'
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

export default AddProjectTask;
