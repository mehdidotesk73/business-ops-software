import Login from "../../pages/Login";

// ElementSettings.js
export const settings = {
  login: {
    userName: { label: "Username", type: "text", placeholder: "Username" },
    password: { label: "Password", type: "password", placeholder: "Password" },
  },
  register: {
    username: {
      label: "Username",
      type: "text",
      placeholder: "* Required",
    },
    password: {
      label: "Password",
      type: "password",
      placeholder: "* Required",
    },
    horizontalLine: { label: "", type: "hr" },
    firstName: {
      label: "First Name",
      type: "text",
      placeholder: "* Required",
    },
    lastName: {
      label: "Last Name",
      type: "text",
      placeholder: "* Required",
    },
    email: {
      label: "Email",
      type: "text",
      placeholder: "* Required",
    },
  },
  user: {
    username: {
      label: "Username",
      type: "text",
      placeholder: "* Required",
    },
    password: {
      label: "Password",
      type: "password",
      placeholder: "* Required",
    },
    horizontalLine: { label: "", type: "hr" },
    firstName: {
      label: "First Name",
      type: "text",
      placeholder: "* Required",
    },
    lastName: {
      label: "Last Name",
      type: "text",
      placeholder: "* Required",
    },
    email: {
      label: "Email",
      type: "text",
      placeholder: "* Required",
    },
  },
  material: {
    name: { label: "Material Name", type: "text" },
    unit: { label: "Unit", type: "text" },
    unitPrice: { label: "Unit Price", type: "number" },
    description: { label: "Description", type: "textarea" },
  },
  task: {
    name: { label: "Task Name", type: "text" },
    laborHours: { label: "Labor Hours", type: "number" },
    description: { label: "Description", type: "textarea" },
  },
  project: {
    name: { label: "Project Name", type: "text" },
    clientName: { label: "Client Name", type: "text" },
    siteLocation: { label: "Site Location", type: "textarea" },
    zipcode: { label: "Zipcode", type: "text" },
    description: { label: "Description", type: "textarea" },
    contingency: { label: "Contingency", type: "number" },
  },
  employee: {
    hourlyRate: { label: "Hourly Rate", type: "number" },
    phoneNumber: { label: "Phone Number", type: "text" },
    overallRating: { label: "Rating", type: "rating" },
  },
  client: {
    phoneNumber: { label: "Phone Number", type: "text" },
  },
};
