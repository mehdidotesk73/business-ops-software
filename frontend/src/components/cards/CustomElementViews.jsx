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
import EmployeeTaskRatingModal from "../modals/EmployeeTaskRatingModal";
import LoadingIndicator from "../LoadingIndicator";

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

  if (loading) return <LoadingIndicator />;

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

  if (loading) return <LoadingIndicator />;

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
      camelCaseData.coordinatorName = camelCaseData.coordinator
        ? camelCaseData.coordinator.name
        : "";
      setProjectInfo(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error);
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
    return <LoadingIndicator />;
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

export function ProjectReportView({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // Use propId if passed, otherwise use paramId
  const [projectReport, setProjectReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectReport();
  }, []);

  const getProjectReport = async () => {
    try {
      const res = await api.post(`/api/projects/${id}/report/`, {
        commuteTime: 0,
      });
      if (res.status === 200) {
        // alert("Project Analyzed.");
      } else {
        alert("Failed to run project report.");
      }
      // console.log(res.data);
      const camelCaseData = keysToCamelCase(res.data);
      setProjectReport(camelCaseData);
    } catch (error) {
      alert(error);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  } else {
    console.log(projectReport);
    projectReport.inputReport.creatorName =
      projectReport.inputReport.creator.name;
    projectReport.inputReport.coordinatorPhoneNumber =
      projectReport.inputReport.employee.phoneNumber;
    projectReport.inputReport.coordinatorName =
      projectReport.inputReport.coordinator.name;
  }

  return projectReport ? (
    <>
      <ElementViewCard
        type='projectInputReport'
        element={projectReport.inputReport}
      ></ElementViewCard>

      <TableViewCard
        title='Tasks list'
        table={
          <ElementTable
            tableKey='projectTask'
            elements={projectReport.inputReport.tasks}
            actions={null}
          ></ElementTable>
        }
      ></TableViewCard>

      <TableViewCard
        title='Materials list'
        table={
          <ElementTable
            tableKey='projectMaterial'
            elements={projectReport.inputReport.allMaterials}
            actions={null}
          ></ElementTable>
        }
      ></TableViewCard>

      <ElementViewCard
        type='projectCostReport'
        element={projectReport.costReport}
      ></ElementViewCard>

      <ElementViewCard
        type='projectProfitReport'
        element={projectReport.profitReport}
      ></ElementViewCard>
    </>
  ) : null;
}

export function MainUserView({ id: propId }) {
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

  const onSubmitEmployeeTaskRatings = async (employeeId, taskRatings) => {
    for (const [taskId, rating] of Object.entries(taskRatings)) {
      const payload = {
        employee_id: employeeId,
        task_id: taskId,
        rating: rating,
      };
      try {
        await api.put(`/api/employee-ratings/by-employee-and-task/`, payload);
      } catch (error) {
        console.error(
          `Error updating task ${taskId} for employee ${employeeId}:`,
          error
        );
      }
    }
    getUser();
  };

  if (loading) {
    return <LoadingIndicator />;
  } else {
    console.log("User:", userInfo);
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
        <>
          <ElementViewCard
            type='employee'
            element={userInfo.employeeProfile}
          ></ElementViewCard>
          <EmployeeTaskRatingModal
            onSubmit={(data) =>
              onSubmitEmployeeTaskRatings(userInfo.employeeProfile.id, data)
            }
            employee={userInfo.employeeProfile}
          ></EmployeeTaskRatingModal>
        </>
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

export function SelfUserView({ id: propId }) {
  const [user, setUser] = useState(null);
  const { auth } = useContext(UserContext);
  const { userId, authenticate } = auth;
  const navigate = useNavigate;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get(`/api/user/${userId}/`);
      const camelCaseData = keysToCamelCase(res.data);
      setUser(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { id: paramId } = useParams();
  const id = propId || paramId; // Use propId if passed, otherwise use paramId
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getUser();
  // }, []);

  // const getUser = async () => {
  //   try {
  //     const res = await api.get(`/api/users/${id}/`);
  //     const camelCaseData = keysToCamelCase(res.data);
  //     setUserInfo(camelCaseData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return <p>Loading...</p>;
  } else {
    console.log("User:", userInfo);
  }

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
        <>
          <ElementViewCard
            type='employee'
            element={userInfo.employeeProfile}
          ></ElementViewCard>
          <EmployeeTaskRatingModal
            onSubmit={(data) =>
              onSubmitEmployeeTaskRatings(userInfo.employeeProfile.id, data)
            }
            employee={userInfo.employeeProfile}
          ></EmployeeTaskRatingModal>
        </>
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
