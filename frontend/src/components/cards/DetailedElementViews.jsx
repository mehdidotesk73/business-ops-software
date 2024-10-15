import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import ElementViewCard from "./ElementViewCard";
import TableViewCard from "./TableViewCard";
import ElementTable from "../tabulars/ElementTable";
import { keysToCamelCase } from "../caseConverters";
import TaskMaterialModal from "../modals/TaskMaterialModal";
import ProjectMaterialModal from "../modals/ProjectMaterialModal";
import ProjectTaskModal from "../modals/ProjectTaskModal";

export function DetailedMaterialView({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // Use propId if passed, otherwise use paramId
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaterial();
  }, []);

  const getMaterial = async () => {
    try {
      const res = await api.get(`/api/materials/${id}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setMaterial(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return material ? (
    <>
      <ElementViewCard type='material' element={material}></ElementViewCard>
    </>
  ) : null;
}

export function DetailedTaskView({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // Use propId if passed, otherwise use paramId
  const [taskInfo, setTaskInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    try {
      const res = await api.get(`/api/tasks/${id}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setTaskInfo(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskMaterial = (material) => {
    api
      .delete(
        `/api/task-materials/?task=${(taskInfo, id)}&material=${material.id}`
      )
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete material.");
        getTask();
      })
      .catch((error) => alert(error));
  };

  if (loading) return <p>Loading...</p>;

  return taskInfo ? (
    <>
      <ElementViewCard type='task' element={taskInfo.task}></ElementViewCard>
      <TableViewCard
        title='Materials list'
        table={
          <ElementTable
            type='taskMaterial'
            elements={taskInfo.materials}
            withActions={true}
            onDelete={deleteTaskMaterial}
          ></ElementTable>
        }
      ></TableViewCard>
      <TaskMaterialModal taskId={taskInfo.task.id} onAdd={getTask} />
    </>
  ) : null;
}

export function DetailedProjectView({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // Use propId if passed, otherwise use paramId
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject();
  }, []);

  const getProject = async () => {
    try {
      const res = await api.get(`/api/projects/${id}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setProjectInfo(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProjectMaterial = (material) => {
    api
      .delete(
        `/api/project-materials/?project=${(projectInfo, id)}&material=${
          material.id
        }`
      )
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete material.");
        getProject();
      })
      .catch((error) => alert(error));
  };

  const deleteProjectTask = (task) => {
    api
      .delete(
        `/api/project-tasks/?project=${(projectInfo, id)}&task=${task.id}`
      )
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete task.");
        getProject();
      })
      .catch((error) => alert(error));
  };

  if (loading) {
    return <p>Loading...</p>;
  } else console.log(projectInfo);

  return projectInfo ? (
    <>
      <ElementViewCard
        type='project'
        element={projectInfo.project}
      ></ElementViewCard>
      <TableViewCard
        title='Tasks list'
        table={
          <ElementTable
            type='projectTask'
            elements={projectInfo.tasks}
            withActions={true}
            onDelete={deleteProjectTask}
          ></ElementTable>
        }
      ></TableViewCard>
      <ProjectTaskModal projectId={projectInfo.project.id} onAdd={getProject} />

      <TableViewCard
        title='Materials list'
        table={
          <ElementTable
            type='projectMaterial'
            elements={projectInfo.materials}
            withActions={true}
            onDelete={deleteProjectMaterial}
          ></ElementTable>
        }
      ></TableViewCard>
      <ProjectMaterialModal
        projectId={projectInfo.project.id}
        onAdd={getProject}
      />
    </>
  ) : null;
}
