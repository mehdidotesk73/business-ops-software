// ElementSettings.js
export const settings = {
  material: {
    name: { label: "Name", type: "text" },
    unit: { label: "Unit", type: "text" },
    unitPrice: { label: "Unit Price", type: "number" },
    description: { label: "Description", type: "textarea" },
  },
  task: {
    name: { label: "Name", type: "text" },
    laborHours: { label: "Labor Hours", type: "number" },
    description: { label: "Description", type: "textarea" },
  },
  project: {
    projectName: { label: "Project Name", type: "text" },
    startDate: { label: "Start Date", type: "date" },
    endDate: { label: "End Date", type: "date" },
    budget: { label: "Budget", type: "number" },
    description: { label: "Description", type: "textarea" },
  },
};
