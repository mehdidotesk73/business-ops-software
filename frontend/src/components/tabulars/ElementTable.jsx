import React from "react";
import { elementDisplayFields } from "../ElementDisplaySettings";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/TableRow.module.css";
import ViewModal from "../modals/ViewModal";
import ModifyModal from "../modals/ModifyModal";

function ElementTable({
  type,
  elements,
  onDelete = null,
  onModify = null,
  onInspect = null,
  withActions = false,
}) {
  let getChildren;
  switch (type) {
    case "task":
      getChildren = async (element) => {
        return { materials: element.materials };
      };
      break;
    case "project":
      getChildren = async (element) => {
        return { tasks: element.tasks, materials: element.materials };
      };
      break;
  }

  const navigate = useNavigate();
  // Get the row-display-settings for element type to be displayed.
  // Row display setting must be defined.
  const fields = elementDisplayFields[type]?.row || {};

  // Create row constructor.
  // Check if row display settings has any prefixes or suffixes for the display.
  // Create Modify button if onModify function is passed.
  // Create Delete button if onDelete function is passed.
  function row(element) {
    return (
      <tr key={element.id}>
        {Object.keys(fields).map((key) => {
          let data = element[key];
          fields[key]["map"] ? (data = fields[key]["map"](data)) : null;
          fields[key]["prefix"] ? (data = fields[key]["prefix"] + data) : null;
          fields[key]["suffix"] ? (data = data + fields[key]["suffix"]) : null;
          const td = (
            <td
              key={`${element.id}-${key}`}
              className={`${styles.tableTextRow}`}
            >
              {data}
            </td>
          );
          return td;
        })}

        {withActions && (
          <td
            key={`${element.id}-actions`}
            className={`${styles.tableRow}`}
            style={{ display: "flex", gap: "5px" }}
          >
            <ViewModal type={type} element={element} />
            {onModify && (
              <ModifyModal
                onSubmit={onModify}
                method='edit'
                type={type}
                element={element}
              />
            )}
            {onInspect && (
              <button
                type='button'
                className='btn btn-outline-light btn-sm'
                onClick={() => onInspect(element)}
              >
                Details
              </button>
            )}
            {onDelete && (
              <button
                type='button'
                className='btn btn-danger btn-sm'
                onClick={() => onDelete(element)}
              >
                Delete
              </button>
            )}
          </td>
        )}
      </tr>
    );
  }

  return (
    <table key={type} className='table'>
      <thead key={`${type}-thead`}>
        <tr key={`${type}-thead-row`}>
          {Object.keys(fields).map((key) => (
            <th key={`${type}-${key}`} className={styles.tableHeader}>
              {fields[key]["as"]}
            </th>
          ))}
          {withActions && <th className={styles.tableHeader}>Actions</th>}
        </tr>
      </thead>
      <tbody key={`${type}-tbody`}>
        {elements.map((element) => row(element))}
      </tbody>
    </table>
  );
}

export default ElementTable;
