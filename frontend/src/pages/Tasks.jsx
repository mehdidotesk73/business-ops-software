import { useState, useEffect, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ViewModal from "../components/modals/ViewModal";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";
import BatchCreateElements from "../components/modals/BatchCreateElements";
import LoadingIndicator from "../components/LoadingIndicator";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tasks/");
      const camelCaseData = keysToCamelCase(res.data);
      setTasks(camelCaseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error);
      setLoading(false);
    }
  };

  const deleteTask = (element) => {
    api
      .delete(`/api/tasks/${element.id}/`)
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete task.");
        getTasks();
      })
      .catch((error) => alert(error));
  };

  const createTask = (taskData) => {
    api
      .post("/api/tasks/", {
        name: taskData.name,
        labor_hours: taskData.laborHours,
        description: taskData.description,
      })
      .then((res) => {
        if (res.status === 201);
        else alert("Failed to create task.");
        getTasks();
      })
      .catch((error) => alert(error));
  };

  const batchCreateTask = (taskData) => {
    setLoading(true);
    api
      .post("/api/tasks/batch-create/", taskData)
      .then((res) => {
        if (res.status === 200);
        else alert("Failed to create tasks.");
        getTasks();
      })
      .catch((error) => {
        alert(error.response.data.error);
        setLoading(false);
      });
  };

  const updateTask = (taskData) => {
    api
      .put(`/api/tasks/${taskData.id}/`, {
        name: taskData.name,
        labor_hours: taskData.laborHours,
        description: taskData.description,
      })
      .then((res) => {
        if (res.status === 200);
        else alert("Failed to update task.");
        getTasks();
      })
      .catch((error) => alert(error));
  };

  const inspectTask = (element) => {
    navigate(`/tasks/${element.id}`);
  };

  const viewModal = cloneElement(<ViewModal type='task' />, { element: null });
  const modifyModal = cloneElement(
    <ModifyModal
      onSubmit={updateTask}
      method='edit'
      type='task'
      buttonClassName='btn btn-outline-dark btn-sm'
    />,
    { element: null }
  );

  const actions = [
    { label: "View", action: viewModal },
    {
      label: "Modify",
      action: modifyModal,
    },
    {
      label: "Inspect",
      action: inspectTask,
      buttonClassName: "btn btn-outline-dark btn-sm",
    },
    {
      label: "Delete",
      action: deleteTask,
      buttonClassName: "btn btn-danger btn-sm",
    },
  ];

  return (
    <div>
      <div>
        <h2>Tasks</h2>
        <div>
          <ModifyModal
            onSubmit={createTask}
            method='add'
            type='task'
            buttonClassName='btn btn-success btn-sm'
          />
          &nbsp;
          <BatchCreateElements onSubmit={batchCreateTask} type={"task"} />
        </div>
        {tasks.length > 0 && (
          <ElementTable
            tableKey='task'
            elements={tasks}
            actions={actions}
          ></ElementTable>
        )}
        {loading && <LoadingIndicator />}
      </div>
    </div>
  );
}

export default TasksPage;
