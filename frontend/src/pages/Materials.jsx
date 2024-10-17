import { useState, useEffect, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ViewModal from "../components/modals/ViewModal";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";

function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMaterials();
  }, []);

  const getMaterials = async () => {
    try {
      const res = await api.get("/api/materials/");
      const camelCaseData = keysToCamelCase(res.data);
      setMaterials(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteMaterial = (element) => {
    api
      .delete(`/api/materials/${element.id}/`)
      .then((res) => {
        if (res.status === 204);
        else alert("Failed to delete material.");
        getMaterials();
      })
      .catch((error) => alert(error));
  };

  const createMaterial = (materialData) => {
    api
      .post("/api/materials/", {
        name: materialData.name,
        unit: materialData.unit,
        unit_price: materialData.unitPrice,
        description: materialData.description,
      })
      .then((res) => {
        if (res.status === 201);
        else alert("Failed to create material.");
        getMaterials();
      })
      .catch((error) => alert(error));
  };

  const updateMaterial = (materialData) => {
    api
      .put(`/api/materials/${materialData.id}/`, {
        name: materialData.name,
        unit: materialData.unit,
        unit_price: materialData.unitPrice,
        description: materialData.description,
      })
      .then((res) => {
        if (res.status === 200);
        else alert("Failed to update material.");
        getMaterials();
      })
      .catch((error) => alert(error));
  };

  const inspectMaterial = (element) => {
    navigate(`/materials/${element.id}`);
  };

  const viewModal = cloneElement(
    <ViewModal type='material' buttonClassName='btn btn-info btn-sm' />,
    {
      element: null,
    }
  );
  const modifyModal = cloneElement(
    <ModifyModal
      onSubmit={updateMaterial}
      method='edit'
      type='material'
      buttonClassName='btn btn-outline-light btn-sm'
    />,
    { element: null }
  );

  const actions = [
    { label: "View", action: viewModal },
    { label: "Modify", action: modifyModal },
    {
      label: "Inspect",
      action: inspectMaterial,
      buttonClassName: "btn btn-outline-light btn-sm",
    },
    {
      label: "Delete",
      action: deleteMaterial,
      buttonClassName: "btn btn-danger btn-sm",
    },
  ];

  return (
    <div>
      <div>
        <h2>Materials</h2>
        <div>
          <ModifyModal
            onSubmit={createMaterial}
            method='add'
            type='material'
            buttonClassName='btn btn-success btn-sm'
          />
        </div>
        {materials.length > 0 && (
          <ElementTable
            tableKey='material'
            elements={materials}
            actions={actions}
          />
        )}
      </div>
    </div>
  );
}

export default MaterialsPage;
