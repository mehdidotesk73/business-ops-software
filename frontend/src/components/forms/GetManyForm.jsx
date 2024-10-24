// DynamicForm.js
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { settings } from "./ElementFormSettings";

const GetManyForm = ({ elements, inputList, inputTags, onSubmit }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = settings[type];

  return (
    <>
      {type ? (
        <form onSubmit={handleSubmit}>
          {Object.keys(fields).map((key) => {
            const { label, type } = fields[key];
            return (
              <div key={key} className='form-group row align-items-center'>
                <label htmlFor={key} className='col col-form-label'>
                  {label + ":"}
                </label>
                <div className='col'>
                  {type === "textarea" ? (
                    <textarea
                      className='form-control'
                      id={key}
                      name={key}
                      required
                      onChange={handleChange}
                      value={formData[key] || ""}
                    />
                  ) : type === "rating" ? (
                    <Rating
                      id={key}
                      name={key}
                      required
                      onChange={handleRatingChange}
                      value={formData[key] || 0}
                    />
                  ) : (
                    <input
                      className='form-control'
                      type={type}
                      id={key}
                      name={key}
                      required
                      onChange={handleChange}
                      value={formData[key] || ""}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <input type='submit' value='Submit' />
        </form>
      ) : null}
    </>
  );
};

export default GetManyForm;
