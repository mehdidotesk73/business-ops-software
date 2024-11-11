import React from "react";
import { elementDisplayFields } from "../ElementDisplaySettings";
import styles from "../../styles/Card.module.css";
import { Rating } from "@mui/material";

function ElementViewCard({ type, element }) {
  let headerElements = [];
  let bodyElements = [];
  let footerElements = [];

  let cardHeader;
  let cardBody;
  let cardFooter;

  // Get the card-display-settings for element type to be displayed.
  // Card display setting must be defined.
  const fields = elementDisplayFields[type]?.card || {};

  Object.keys(fields).forEach((key) => {
    let data;
    let label;
    if (element.hasOwnProperty(key)) {
      data = element[key];
    } else {
      data = fields[key].data;
    }
    if (fields[key].map) data = fields[key].map(data);
    if (fields[key].prefix) data = fields[key].prefix + data;
    if (fields[key].suffix) data = data + fields[key].suffix;
    label = fields[key]["as"] ? fields[key]["as"] + ": " : "";

    const tag = fields[key]["tag"] || "p"; // Default to <p> if no tag is specified
    const style = fields[key]["place"] === "header" ? null : styles.cardBody; // Keep default style for header
    const className = fields[key]["className"] || "";
    const cardElement = React.createElement(
      tag,
      { key, className: `${className} ${style}` },
      fields[key].special === "Rating"
        ? [
            <div key={key} style={{ display: "flex" }}>
              <p style={{ marginRight: "10px" }}>{label}</p>
              {React.createElement(Rating, {
                key,
                readOnly: true,
                precision: 0.5,
                value: parseFloat(data),
              })}
            </div>,
          ]
        : label + data
    );

    if (fields[key]["place"] === "header") {
      headerElements = [...headerElements, cardElement];
    }
    if (fields[key]["place"] === "body") {
      bodyElements = [...bodyElements, cardElement];
    }
  });

  cardHeader = <div className={styles.cardHeader}>{headerElements}</div>;
  cardBody = (
    <div className={styles.cardBody}>
      <ul className={`list-group list-group-flush ${styles.cardBody}`}>
        {bodyElements}
      </ul>
    </div>
  );

  const card = (
    <div className='col'>
      <div className='card border-white mb-1 '>
        {cardHeader}
        {cardBody}
      </div>
    </div>
  );

  return card;
}

export default ElementViewCard;
