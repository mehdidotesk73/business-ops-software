import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DetailedMaterialView,
  DetailedTaskView,
  DetailedProjectView,
  DetailedUserView,
} from "../cards/DetailedElementViews";
import { capitalizeFirstLetters } from "../caseConverters";

function ViewModal({
  type,
  element,
  label = "View",
  buttonClassName = "btn btn-light btn-sm",
}) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const typeMap = {
    material: "material",
    taskMaterial: "material",
    task: "task",
    projectTask: "task",
    project: "project",
    user: "user",
  };
  type = typeMap[type];

  let purpose = "View " + type;
  purpose = capitalizeFirstLetters(purpose);

  const modal = (
    <>
      <button type='button' className={buttonClassName} onClick={handleShow}>
        {label}
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
                ) : type === "user" ? (
                  <DetailedUserView id={element.id} />
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
