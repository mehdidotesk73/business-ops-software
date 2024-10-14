import { useState, useEffect } from "react";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ViewModal from "../components/modals/ViewModal";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";
import DetailedView from "../components/DetailedTaskView";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const res = await api.get("/api/tasks/");
      const camelCaseData = keysToCamelCase(res.data);
      setTasks(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteTask = (element) => {
    api
      .delete(`/api/tasks/${element.id}/`)
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete material.");
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
        else alert("Failed to create material.");
        getTasks();
      })
      .catch((error) => alert(error));
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
        else alert("Failed to update material.");
        getTasks();
      })
      .catch((error) => alert(error));
  };

  const detailView = (taskId) => {
    return <DetailedView id={taskId} />;
  };

  return (
    <div>
      <div>
        <h2>Tasks</h2>
        <div>
          <ModifyModal onSubmit={createTask} method='add' type='task' />
        </div>
        {tasks.length > 0 && (
          <ElementTable
            type='task'
            elements={tasks}
            onDelete={deleteTask}
            onModify={updateTask}
            withActions={true}
          ></ElementTable>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
