import React, { useState, useEffect } from "react";
import ModifyProfile from "../forms/ModifyProfile";
import DeleteProfile from "../forms/DeleteProfile";

// ProfileModal component
function ProfileModal({ element, method, onAdd }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <button
        type='button'
        className={
          method === "add"
            ? "btn btn-success btn-sm"
            : method === "delete"
            ? "btn btn-danger btn-sm"
            : null
        }
        onClick={handleShow}
      >
        {method === "add"
          ? "Add/Overwrite profile"
          : method === "delete"
          ? "Delete profile"
          : null}
      </button>
      {showModal && (
        <div className='modal show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between align-items-center'>
                <h5 className='modal-title'>Add profile</h5>
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
                {method === "add" ? (
                  <ModifyProfile
                    userId={element.id}
                    method={method}
                    onAdd={onAdd}
                  />
                ) : method === "delete" ? (
                  <DeleteProfile userId={element.id} onAdd={onAdd} />
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
}

export default ProfileModal;
