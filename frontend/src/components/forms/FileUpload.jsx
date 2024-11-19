import React, { useState } from "react";
import api from "../../api";

const FileUpload = ({ onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='file' accept='.csv' onChange={handleFileChange} />
      <input type='submit' value='Submit' />
    </form>
  );
};

export default FileUpload;
