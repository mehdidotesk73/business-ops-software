import React from "react";
import { elementDisplayFields } from "../ElementDisplaySettings";
import styles from "../../styles/TableRow.module.css";

function ElementTable({ tableKey = "table", elements, actions = null }) {
  // Get the row-display-settings for element type to be displayed
  const fields = elementDisplayFields[tableKey]?.row || {};

  // Construct row for each element
  function row(element) {
    return (
      <tr key={element.id}>
        {Object.keys(fields).map((key) => {
          let data = element[key];
          if (fields[key].map) data = fields[key].map(data);
          if (fields[key].prefix) data = fields[key].prefix + data;
          if (fields[key].suffix) data = data + fields[key].suffix;

          return (
            <td key={`${element.id}-${key}`} className={styles.tableTextRow}>
              {data}
            </td>
          );
        })}
        {actions && (
          <td key={`${element.id}-actions`} className={`${styles.tableRow}`}>
            {actions.map((action, index) => (
              <React.Fragment key={`${element.id}-${index}`}>
                {index % 4 === 0 && index !== 0 && <div></div>}
                <div className={styles.buttonContainer}>
                  {typeof action.action === "function" ? (
                    <button
                      key={index}
                      type='button'
                      className={
                        action.buttonClassName
                          ? action.buttonClassName
                          : "btn btn-light btn-sm"
                      }
                      onClick={() => action.action(element)}
                    >
                      {action.label}
                    </button>
                  ) : (
                    React.cloneElement(action.action, { key: index, element })
                  )}
                </div>
              </React.Fragment>
            ))}
          </td>
        )}
      </tr>
    );
  }

  return (
    <table key={tableKey} className='table'>
      <thead key={`${tableKey}-thead`}>
        <tr key={`${tableKey}-thead-row`}>
          {Object.keys(fields).map((key) => (
            <th key={`${tableKey}-${key}`} className={styles.tableHeader}>
              {fields[key].as}
            </th>
          ))}
          {actions && <th className={styles.tableHeader}>Actions</th>}
        </tr>
      </thead>
      <tbody key={`${tableKey}-tbody`}>
        {elements.map((element) => row(element))}
      </tbody>
    </table>
  );
}

export default ElementTable;
