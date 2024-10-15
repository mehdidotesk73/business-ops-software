import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DetailedMaterialView,
  DetailedTaskView,
  DetailedProjectView,
} from "../cards/DetailedElementViews";
import { capitalizeFirstLetters } from "../caseConverters";

function ViewModal({ type, element }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);

  switch (type) {
    case "material":
    case "taskMaterial":
      type = "material";
      break;
    case "task":
    case "projectTask":
      type = "task";
      break;
    case "project":
      type = "project";
      break;
  }

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
                  <DetailedMaterialView id={element.id} />
                ) : type === "task" ? (
                  <DetailedTaskView id={element.id} />
                ) : type === "project" ? (
                  <DetailedProjectView id={element.id} />
                ) : null}
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
