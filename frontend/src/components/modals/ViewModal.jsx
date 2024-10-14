import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ElementViewCard from "../cards/ElementViewCard";
import DetailedView from "../DetailedTaskView";
import { keysToCamelCase, capitalizeFirstLetters } from "../caseConverters";

function ViewModal({ type, element }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);

  //   const [taskMaterials, setTaskMaterials] = useState([]);
  //   const handleShow = () => {
  //     api
  //       .get(`/api/tasks/${element.id}/`)
  //       .then((response) => {
  //         setTaskMaterials(keysToCamelCase(response.data.materials));
  //         setShowModal(true);
  //       })
  //       .catch((error) => console.error("Error fetching task materials:", error));
  //   };

  const handleClose = () => setShowModal(false);

  let purpose = "View " + type;
  purpose = capitalizeFirstLetters(purpose);

  const modal = (
    <>
      <button
        type='button'
        className='btn btn-info btn-sm'
        onClick={handleShow}
      >
        View
      </button>

      {showModal && (
        <div className='modal show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between align-items-center'>
                <h5 className='modal-title'>{purpose}</h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleClose}
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {type === "material" ? (
                  <ElementViewCard type={type} element={element} />
                ) : type === "task" ? (
                  <DetailedView id={element.id} />
                ) : type === "project" ? null : null}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return modal;
}

export default ViewModal;
