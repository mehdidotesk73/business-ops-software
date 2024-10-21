import { useState, useEffect, cloneElement } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import ElementViewCard from "./ElementViewCard";
import TableViewCard from "./TableViewCard";
import ElementTable from "../tabulars/ElementTable";
import { keysToCamelCase } from "../caseConverters";
import ViewModal from "../modals/ViewModal";
import ProfileModal from "../modals/ProfileModal";
import ParentChildModal from "../modals/ParentChildModal";

export function MainMaterialView({ id: propId }) {
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

export function MainTaskView({ id: propId }) {
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

  const viewMaterialModal = cloneElement(
    <ViewModal type='material' buttonClassName='btn btn-info btn-sm' />,
    { element: null }
  );

  const materialActions = [
    { label: "View", action: viewMaterialModal },
    {
      label: "Delete",
      action: deleteTaskMaterial,
      buttonClassName: "btn btn-danger btn-sm",
    },
  ];

  return taskInfo ? (
    <>
      <ElementViewCard type='task' element={taskInfo}></ElementViewCard>
      <TableViewCard
        title='Materials list'
        table={
          <ElementTable
            tableKey='taskMaterial'
            elements={taskInfo.materials}
            actions={materialActions}
            withActions={true}
          ></ElementTable>
        }
      ></TableViewCard>
      <ParentChildModal
        parentType={"task"}
        parentId={taskInfo.id}
        childType={"material"}
        onAdd={getTask}
      />
    </>
  ) : null;
}

export function MainProjectView({ id: propId }) {
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
      camelCaseData.creatorName = camelCaseData.creator.name;
      camelCaseData.coordinatorName = camelCaseData.coordinator.name;
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

  const viewTaskModal = cloneElement(
    <ViewModal type='task' buttonClassName='btn btn-info btn-sm' />,
    { element: null }
  );

  const taskActions = [
    { label: "View", action: viewTaskModal },
    {
      label: "Delete",
      action: deleteProjectTask,
      buttonClassName: "btn btn-danger btn-sm",
    },
  ];

  const viewMaterialModal = cloneElement(
    <ViewModal type='material' buttonClassName='btn btn-info btn-sm' />,
    { element: null }
  );

  const materialActions = [
    { label: "View", action: viewMaterialModal },
    {
      label: "Delete",
      action: deleteProjectMaterial,
      buttonClassName: "btn btn-danger btn-sm",
    },
  ];

  return projectInfo ? (
    <>
      <ElementViewCard type='project' element={projectInfo}></ElementViewCard>
      <TableViewCard
        title='Tasks list'
        table={
          <ElementTable
            tableKey='projectTask'
            elements={projectInfo.tasks}
            actions={taskActions}
          ></ElementTable>
        }
      ></TableViewCard>
      <ParentChildModal
        parentType={"project"}
        parentId={projectInfo.id}
        childType={"task"}
        onAdd={getProject}
      />

      <TableViewCard
        title='Materials list'
        table={
          <ElementTable
            tableKey='projectMaterial'
            elements={projectInfo.materials}
            actions={materialActions}
          ></ElementTable>
        }
      ></TableViewCard>
      <ParentChildModal
        parentType={"project"}
        parentId={projectInfo.id}
        childType={"material"}
        onAdd={getProject}
      />
    </>
  ) : null;
}

export function MainAccountView({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // Use propId if passed, otherwise use paramId
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get(`/api/users/${id}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setUserInfo(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleProfileAdd = () => {
    setLoading(true);
    getUser();
  };

  return userInfo ? (
    <>
      <ElementViewCard type='user' element={userInfo}></ElementViewCard>
      <ProfileModal element={userInfo} method='add' onAdd={handleProfileAdd} />
      <ProfileModal
        element={userInfo}
        method='delete'
        onAdd={handleProfileAdd}
      />
      {userInfo.employeeProfile ? (
        <ElementViewCard
          type='employee'
          element={userInfo.employeeProfile}
        ></ElementViewCard>
      ) : null}
      {userInfo.clientProfile ? (
        <ElementViewCard
          type='client'
          element={userInfo.clientProfile}
        ></ElementViewCard>
      ) : null}
    </>
  ) : null;
}

// Add main account view for users to edit own account.
// Change password
// Change name
// Change contact
