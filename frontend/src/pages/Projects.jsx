import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ViewModal from "../components/modals/ViewModal";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";
import { DetailedTaskView } from "../components/cards/DetailedElementViews";

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
      setProjects(camelCaseData);
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

  return (
    <div>
      <div>
        <h2>Projects</h2>
        <div>
          <ModifyModal onSubmit={createProject} method='add' type='project' />
        </div>
        {projects.length > 0 && (
          <ElementTable
            type='project'
            elements={projects}
            onDelete={deleteProject}
            onModify={updateProject}
            onInspect={(element) => navigate(`/projects/${element.id}`)}
            withActions={true}
          ></ElementTable>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
