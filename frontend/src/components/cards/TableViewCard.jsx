import React from "react";
import { elementDisplayFields } from "../ElementDisplaySettings";
import styles from "../../styles/Card.module.css";

function TableViewCard({ title, table }) {
  let cardHeader;
  let cardBody;

  cardHeader = (
    <div className={styles.cardHeader}>
      <h5>{title}</h5>
    </div>
  );
  cardBody = <div className={styles.cardBody}>{table}</div>;

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

export default TableViewCard;
