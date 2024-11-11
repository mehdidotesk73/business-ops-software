import React, { useState, useEffect } from "react";
import AssignProject from "../forms/AssignProject";
import api from "../../api";

// ProfileModal component
function ProjectAssignModal({ element, onSubmit }) {
  const [showModal, setShowModal] = useState(false);
  const method = element.coordinator ? "unassign" : "assign";

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  function handleUnassign() {
    api
      .post(`api/projects/${element.id}/unassign-coordinator/`, {})
      .then((response) => {
        if (response.status === 200) {
          onSubmit(response.data);
        } else
          alert(`Failed to unassign coordinator. STATUS: ${response.status}`);
      })
      .catch((error) => console.error("Error unassigning coordinator:", error));
  }

  const handleAssignment = method === "assign" ? handleShow : handleUnassign;

  return (
    <>
      <button
        type='button'
        className={
          method === "assign"
            ? "btn btn-success btn-sm"
            : "btn btn-warning btn-sm"
        }
        onClick={handleAssignment}
      >
        {method === "assign" ? "Assign" : "Unassign"}
      </button>

      {showModal && (
        <div className='modal show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between align-items-center'>
                <h5 className='modal-title'>Assign project</h5>
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
                <AssignProject
                  projectId={element.id}
                  onSubmit={() => {
                    handleClose();
                    onSubmit();
                  }}
                />
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

export default ProjectAssignModal;
