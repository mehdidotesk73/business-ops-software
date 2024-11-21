// DynamicForm.js
import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { settings } from "./ElementFormSettings";
import LoadingIndicator from "../LoadingIndicator";

const DynamicForm = ({ type, onSubmit, element = null }) => {
  const [formData, setFormData] = useState(element || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, className } = e.target;
    if (className === "MuiRating-visuallyHidden") {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = settings[type];

  return (
    <>
      {type ? (
        <form onSubmit={handleSubmit} style={{ color: "black" }}>
          {Object.keys(fields).map((key) => {
            const { label, type, placeholder } = fields[key];
            return (
              <div key={key} className='form-group row align-items-center'>
                {label && (
                  <label htmlFor={key} className='col col-form-label'>
                    {label + ":"}
                  </label>
                )}
                <div className='col'>
                  {type === "textarea" ? (
                    <textarea
                      className='form-control'
                      id={key}
                      name={key}
                      required
                      onChange={handleChange}
                      value={formData[key] || ""}
                      placeholder={placeholder}
                    />
                  ) : type === "rating" ? (
                    <Rating
                      id={key}
                      name={key}
                      required
                      onChange={handleChange}
                      value={formData[key] || 0}
                    />
                  ) : type === "hr" ? (
                    <hr />
                  ) : (
                    <input
                      className='form-control'
                      type={type}
                      id={key}
                      name={key}
                      required
                      onChange={handleChange}
                      value={formData[key] || ""}
                      placeholder={placeholder}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {loading && <LoadingIndicator />}
          <input type='submit' value='Submit' />
        </form>
      ) : null}
    </>
  );
};

export default DynamicForm;
