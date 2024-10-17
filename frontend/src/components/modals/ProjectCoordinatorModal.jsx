import { useState } from "react";
import AddProjectMaterial from "../forms/AddProjectMaterial";

function ProjectCoordinatorModal({ projectId, onAdd }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const modal = (
    <>
      <button
        type='button'
        className='btn btn-success btn-sm'
        onClick={handleShow}
      >
        Assign
      </button>

      {showModal && (
        <div className='modal show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between align-items-center'>
                <h5 className='modal-title'>Select Coordinator</h5>
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
                <AddProjectMaterial projectId={projectId} onAdd={onAdd} />
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

export default ProjectCoordinatorModal;
