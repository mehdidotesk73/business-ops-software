import { useState, useEffect } from "react";
import api from "../api";
import { keysToCamelCase } from "../components/caseConverters";
import ModifyModal from "../components/modals/ModifyModal";
import ElementTable from "../components/tabulars/ElementTable";

function MaterialsPage() {
  const [materials, setMaterials] = useState([]);

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

  return (
    <div>
      <div>
        <h2>Materials</h2>
        <div>
          <ModifyModal onSubmit={createMaterial} method='add' type='material' />
        </div>
        {materials.length > 0 && (
          <ElementTable
            type='material'
            elements={materials}
            onDelete={deleteMaterial}
            onModify={updateMaterial}
            withActions={true}
          />
        )}
      </div>
    </div>
  );
}

export default MaterialsPage;
