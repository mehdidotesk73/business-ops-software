import { useState, useEffect, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ViewModal from "../components/modals/ViewModal";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";
import ProjectAssignModal from "../components/modals/ProjectAssignModal";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      const res = await api.get("/api/projects/");
      const camelCaseData = keysToCamelCase(res.data);
      let updatedData = camelCaseData.map((project) => ({
        ...project,
        creatorName: project.creator.name,
      }));
      updatedData = updatedData.map((project) => ({
        ...project,
        coordinatorName: project.coordinator ? project.coordinator.name : "",
      }));
      setProjects(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteProject = (element) => {
    api
      .delete(`/api/projects/${element.id}/`)
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete material.");
        getProjects();
      })
      .catch((error) => alert(error));
  };

  const createProject = (projectData) => {
    api
      .post("/api/projects/", {
        name: projectData.name,
        client_name: projectData.clientName,
        site_location: projectData.siteLocation,
        zipcode: projectData.zipcode,
        description: projectData.description,
        contingency: projectData.contingency,
      })
      .then((res) => {
        if (res.status === 201) alert("Project Created.");
        else alert("Failed to create project.");
        getProjects();
      })
      .catch((error) => alert(error));
  };

  const updateProject = (projectData) => {
    api
      .put(`/api/projects/${projectData.id}/`, {
        name: projectData.name,
        client_name: projectData.clientName,
        site_location: projectData.siteLocation,
        zipcode: projectData.zipcode,
        description: projectData.description,
        contingency: projectData.contingency,
      })
      .then((res) => {
        if (res.status === 200);
        else alert("Failed to update project.");
        getProjects();
      })
      .catch((error) => alert(error));
  };

  const inspectProject = (element) => {
    navigate(`/projects/${element.id}`);
  };

  const handleAssign = cloneElement(<ProjectAssignModal />, {
    element: null,
    onSubmit: getProjects,
  });

  const runProjectReport = (element) => {};

  const viewModal = cloneElement(<ViewModal type='project' />, {
    element: null,
  });
  const modifyModal = cloneElement(
    <ModifyModal
      onSubmit={updateProject}
      method='edit'
      type='project'
      buttonClassName='btn btn-outline-dark btn-sm'
    />,
    { element: null }
  );

  const actions = [
    { label: "View", action: viewModal },
    { label: "Modify", action: modifyModal },
    {
      label: "Inspect",
      action: inspectProject,
      buttonClassName: "btn btn-outline-dark btn-sm",
    },

    {
      label: "Delete",
      action: deleteProject,
      buttonClassName: "btn btn-danger btn-sm",
    },
    {
      label: "Assign",
      action: handleAssign,
      // buttonClassName: "btn btn-success btn-sm",
    },
    {
      label: "Report",
      action: runProjectReport,
      buttonClassName: "btn btn-success btn-sm",
    },
  ];

  return (
    <div>
      <div>
        <h2>Projects</h2>
        <div>
          <ModifyModal
            onSubmit={createProject}
            method='add'
            type='project'
            buttonClassName='btn btn-success btn-sm'
          />
        </div>
        {projects.length > 0 && (
          <ElementTable
            tableKey='project'
            elements={projects}
            actions={actions}
          ></ElementTable>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
