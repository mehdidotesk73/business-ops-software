import React from "react";
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
    <div className='col' styles={styles.cardBody}>
      <div className='card border-white mb-1 ' styles={styles.cardBody}>
        {cardHeader}
        {cardBody}
      </div>
    </div>
  );

  return card;
}

export default TableViewCard;
