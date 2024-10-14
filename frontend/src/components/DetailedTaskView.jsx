import { useState, useEffect } from "react";
import api from "../api";
import ElementViewCard from "./cards/ElementViewCard";
import TableViewCard from "./cards/TableViewCard";
import ElementTable from "./tabulars/ElementTable";
import { keysToCamelCase } from "./caseConverters";

function DetailedView(id) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    try {
      const res = await api.get(`/api/tasks/${id.id}/`);
      const camelCaseData = keysToCamelCase(res.data);
      console.log(task);
      setTask(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return task ? (
    <>
      <ElementViewCard type='task' element={task.task}></ElementViewCard>
      <TableViewCard
        title='Materials list'
        table={
          <ElementTable
            type='taskMaterial'
            elements={task.materials}
          ></ElementTable>
        }
      ></TableViewCard>
    </>
  ) : null;
}

export default DetailedView;
