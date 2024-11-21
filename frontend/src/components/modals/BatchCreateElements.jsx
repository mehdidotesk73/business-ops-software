import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { capitalizeFirstLetters } from "../caseConverters";
import FileUpload from "../forms/FileUpload";

function BatchCreateElements({
  onSubmit,
  type,
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
        alert("Cannot batch create projects");
        break;
      case "user":
        alert("Cannot batch create users");
        break;
    }
    handleClose();
  };

  const modalForm = <FileUpload onSubmit={handleSubmit} />;

  let purpose;
  let showButton;

  purpose = "Batch create " + type;
  purpose = capitalizeFirstLetters(purpose);
  showButton = (
    <button type='button' className={buttonClassName} onClick={handleShow}>
      {capitalizeFirstLetters(purpose)}
    </button>
  );

  const modal = (
    <>
      {showButton}

      {showModal && (
        <div
          className='modal show d-block'
          tabIndex='-1'
          role='dialog'
          style={{ color: "black" }}
        >
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

export default BatchCreateElements;
