import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DynamicForm from "../forms/DynamicForm";
import { capitalizeFirstLetters } from "../caseConverters";

function ModifyModal({
  onSubmit,
  method,
  type,
  element = null,
  buttonClassName = "btn btn-dark btn-sm",
}) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = (formData) => {
    switch (type) {
      case "material":
        onSubmit(formData);
        break;
      case "task":
        onSubmit(formData);
        break;
      case "project":
        onSubmit(formData);
        break;
    }
    // handleClose();
  };

  const modalForm = (
    <DynamicForm type={type} onSubmit={handleSubmit} element={element} />
  );

  let purpose;
  let showButton;
  switch (method) {
    case "add":
      purpose = "Add " + type;
      showButton = (
        <button type='button' className={buttonClassName} onClick={handleShow}>
          {capitalizeFirstLetters("New " + type)}
        </button>
      );
      break;
    case "edit":
      purpose = "Edit " + type;
      showButton = (
        <button type='button' className={buttonClassName} onClick={handleShow}>
          Modify
        </button>
      );
      break;
  }
  purpose = capitalizeFirstLetters(purpose);

  const modal = (
    <>
      {showButton}

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
              <div className='modal-body'>{modalForm}</div>
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

export default ModifyModal;
