import { useState } from "react";
import AddParentChildren from "../forms/AddParentChildren";
import { capitalizeFirstLetters } from "../caseConverters";

function ParentChildModal({ parentType, parentId, childType, taskId, onAdd }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const purpose = capitalizeFirstLetters(`add/change ${childType}s`);
  const modal = (
    <>
      <button
        type='button'
        className='btn btn-success btn-sm'
        onClick={handleShow}
      >
        {purpose}
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
                <AddParentChildren
                  parentType={parentType}
                  parentId={parentId}
                  childType={childType}
                  onAdd={onAdd}
                />

                {/* <AddTaskMaterial taskId={taskId} onAdd={onAdd} /> */}
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

export default ParentChildModal;
