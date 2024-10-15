// ElementSettings.js
export const settings = {
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
};
