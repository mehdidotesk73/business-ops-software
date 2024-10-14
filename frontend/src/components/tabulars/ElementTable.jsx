import React from "react";
import ElementRow from "./ElementRow";
import { elementDisplayFields } from "../ElementDisplaySettings";

function ElementTable({
  type,
  elements,
  onDelete = null,
  onModify = null,
  withActions = false,
  ...rest
}) {
  let getChildren;
  switch (type) {
    case "task":
      getChildren = async (element) => {
        return element.materials;
      };
      break;
    case "project":
      getChildren = async (element) => {
        return element.tasks;
      };
      break;
  }

  const fields = elementDisplayFields[type]?.row || {};
  return (
    <table className='table'>
      <thead>
        <tr>
          {Object.keys(fields).map((key) => (
            <th key={key}>{fields[key]["as"]}</th>
          ))}
          {withActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {elements.map((element) => (
          <ElementRow
            type={type}
            element={element}
            onDelete={onDelete}
            onModify={onModify}
            withActions={withActions}
            key={element.id}
          ></ElementRow>
        ))}
      </tbody>
    </table>
  );
}

export default ElementTable;
