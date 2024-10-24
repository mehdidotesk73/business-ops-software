import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api";
import { keysToCamelCase } from "../caseConverters";
import { Rating } from "@mui/material";

function EmployeeTaskRatingModal({
  onSubmit,
  employee,
  buttonClassName = "btn btn-dark btn-sm",
}) {
  const [showModal, setShowModal] = useState(false);
  const [employeeTasks, setEmployeeTasks] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const getEmployeeTaskRatings = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/employee-ratings/by-employee/?employee_id=${id}`
      );
      const camelCaseData = keysToCamelCase(res.data);
      setEmployeeTasks(camelCaseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeTasks !== null) {
      const updatedFormData = {};
      employeeTasks.forEach((employeeTask) => {
        updatedFormData[employeeTask.task.id] = employeeTask.rating;
      });
      console.log("Updated Form Data: ", updatedFormData);
      setFormData(updatedFormData);
    }
  }, [employeeTasks]);

  const handleShow = async () => {
    await getEmployeeTaskRatings(employee.id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleRatingChange = (taskId, newValue) => {
    setFormData({ ...formData, [taskId]: parseFloat(newValue) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const showButton = (
    <button type='button' className={buttonClassName} onClick={handleShow}>
      Rate Employee at Tasks
    </button>
  );

  const modalForm = (
    <form onSubmit={handleSubmit}>
      {employeeTasks &&
        employeeTasks.map((employeeTask) => (
          <div
            key={employeeTask.task.id}
            style={{ display: "flex", alignItems: "baseline" }}
          >
            <p style={{ marginRight: "10px" }}>
              {employeeTask.task.name + ":"}
            </p>
            <Rating
              name={employeeTask.task.name}
              required
              onChange={(e, newValue) =>
                handleRatingChange(employeeTask.task.id, newValue)
              }
              value={formData[employeeTask.task.id] || 0}
            />
          </div>
        ))}
      <input type='submit' value='Submit' />
    </form>
  );

  const modal = (
    <>
      {showButton}
      {showModal && (
        <div className='modal show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between align-items-center'>
                <h5 className='modal-title'>Rate Employee at Tasks</h5>
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

export default EmployeeTaskRatingModal;
