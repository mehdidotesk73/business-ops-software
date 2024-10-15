const dateMapper = (date) => {
  const dateObj = new Date(date);
  const dateString = dateObj.toLocaleDateString("en-US");
  const timeString = dateObj.toLocaleTimeString("en-US");

  return `${dateString}\n${timeString}`;
};
const dollarMapper = (data) => {
  return "$ " + data;
};
const hourMapper = (data) => {
  return data + " hrs";
};

export const elementDisplayFields = {
  material: {
    row: {
      name: { as: "Name" },
      unit: { as: "Unit" },
      unitPrice: { as: "Unit Price", map: dollarMapper },
      description: { as: "Description" },
    },
    card: {
      name: { as: "Name", place: "header", tag: "h5", className: "card-title" },
      unit: {
        as: "Unit",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      unitPrice: {
        as: "Unit Price",
        prefix: "$ ",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      description: {
        as: "Description",
        place: "header",
        className: "card-text",
      },
    },
    // Add more configurations for other element types as needed
  },

  task: {
    row: {
      name: { as: "Name" },
      laborHours: { as: "Labor Hours", map: hourMapper },
      description: { as: "Description" },
    },
    card: {
      name: { as: "Name", place: "header", tag: "h5", className: "card-title" },
      laborHours: {
        as: "Labor Hours",
        map: hourMapper,
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      description: {
        as: "Description",
        place: "header",
        className: "card-text",
      },
    },
    // Add more configurations for other element types as needed
  },

  project: {
    row: {
      name: { as: "Project" },
      clientName: { as: "Client" },
      siteLocation: { as: "Site" },
      zipcode: { as: "Zipcode" },
      description: { as: "Description" },
      createdAt: { as: "Date Created", map: dateMapper },
      creator: { as: "Creator" },
    },
    card: {
      name: { as: "Name", place: "header", tag: "h5", className: "card-title" },
      clientName: {
        as: "Client",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      siteLocation: {
        as: "Site",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      zipcode: {
        as: "Zipcode",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      contingency: {
        as: "Contingency",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      creator: {
        as: "Creator",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      coordinator: {
        as: "Coordinator",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      description: {
        as: "Description",
        place: "header",
        className: "card-text",
      },
    },
  },

  taskMaterial: {
    row: {
      name: { as: "Material" },
      unitPrice: { as: "Unit Price" },
      quantity: { as: "Quantity" },
    },
  },

  projectMaterial: {
    row: {
      name: { as: "Material" },
      unitPrice: { as: "Unit Price" },
      quantity: { as: "Quantity" },
    },
  },

  projectTask: {
    row: {
      name: { as: "Task" },
      laborHours: { as: "Labor Hours" },
      quantity: { as: "Quantity" },
    },
  },
};
