export const elementDisplayFields = {
  material: {
    row: {
      name: { as: "Name" },
      unit: { as: "Unit" },
      unitPrice: { as: "Unit Price", prefix: "$ " },
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
      laborHours: { as: "Labor Hours", suffix: " hrs" },
      description: { as: "Description" },
    },
    card: {
      name: { as: "Name", place: "header", tag: "h5", className: "card-title" },
      laborHours: {
        as: "Labor Hours",
        suffix: " hrs",
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

  taskMaterial: {
    row: {
      name: { as: "Material" },
      unitPrice: { as: "Unit Price" },
      quantity: { as: "Quantity" },
    },
  },
};
