import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/TableRow.module.css";
import ModifyModal from "../modals/ModifyModal";
import { elementDisplayFields } from "../ElementDisplaySettings";

import ViewModal from "../modals/ViewModal";

function ElementRow({
  type,
  element,
  onDelete,
  onModify,
  withActions,
  ...rest
}) {
  // Get the row-display-settings for element type to be displayed.
  // Row display setting must be defined.
  const fields = elementDisplayFields[type]?.row || {};

  // Create row object.
  // Check if row display settings has any prefixes or suffixes for the display.
  // Create Modify button if onModify function is passed.
  // Create Delete button if onDelete function is passed.
  const row = (
    <tr>
      {Object.keys(fields).map((key) => {
        let data = element[key];
        fields[key]["prefix"] ? (data = fields[key]["prefix"] + data) : null;
        fields[key]["suffix"] ? (data = data + fields[key]["suffix"]) : null;
        const td = (
          <td key={key} className={`${styles.rowPlainText}`}>
            {data}
          </td>
        );
        return td;
      })}

      {withActions && (
        <td
          className={`${styles.rowObjects}`}
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

  return row;
}

export default ElementRow;
