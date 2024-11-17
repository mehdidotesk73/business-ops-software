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
const hourlyRateMapper = (data) => {
  return data + " $/hr";
};
const phoneNumberMapper = (data) => {
  let formattedData;
  if (data.length === 10) {
    formattedData =
      data.substring(0, 3) +
      "-" +
      data.substring(3, 6) +
      "-" +
      data.substring(data.length - 4);
  } else if (data.length > 10) {
    const code = data.substring(0, data.length - 10);
    const lastTen = data.substring(data.length - 10);
    formattedData =
      "(" +
      code +
      ")" +
      lastTen.substring(0, 3) +
      "-" +
      lastTen.substring(3, 6) +
      "-" +
      lastTen.substring(data.length - 4);
  } else {
    formattedData = data;
  }
  return formattedData;
};
const percentageMapper = (data) => {
  const factor = Math.pow(10, 2);
  return Math.round(data * 100 * factor) / factor + "%";
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
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
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
      creatorName: { as: "Creator" },
      coordinatorName: { as: "Coordinator" },
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
        map: percentageMapper,
      },
      creatorName: {
        as: "Creator",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      coordinatorName: {
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
      unitPrice: { as: "Unit Price", map: dollarMapper },
      quantity: { as: "Quantity" },
    },
  },

  projectMaterial: {
    row: {
      name: { as: "Material" },
      unitPrice: { as: "Unit Price", map: dollarMapper },
      quantity: { as: "Quantity" },
    },
  },

  projectTask: {
    row: {
      name: { as: "Task" },
      laborHours: { as: "Labor Hours", map: hourMapper },
      quantity: { as: "Quantity" },
    },
  },

  user: {
    row: {
      firstName: { as: "First Name" },
      lastName: { as: "Last Name" },
      username: { as: "Username" },
      email: { as: "Email" },
    },
    card: {
      title: {
        as: "",
        place: "header",
        tag: "h5",
        className: "card-title",
        data: "User",
      },
      username: {
        as: "Username",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      firstName: {
        as: "First Name",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      lastName: {
        as: "Last Name",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      email: {
        as: "Email",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
    },
  },

  employee: {
    row: {
      hourlyRate: { as: "Hourly Rate", map: hourlyRateMapper },
      phoneNumber: { as: "Phone Number", map: phoneNumberMapper },
      overallRating: { as: "Rate" },
    },
    card: {
      name: {
        as: "",
        place: "header",
        tag: "h5",
        className: "card-title",
      },
      hourlyRate: {
        as: "Hourly Rate",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: hourlyRateMapper,
      },
      phoneNumber: {
        as: "Phone Number",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: phoneNumberMapper,
      },
      overallRating: {
        as: "Rate",
        place: "body",
        tag: "li",
        className: "list-group-item",
        special: "Rating",
      },
    },
  },

  client: {
    row: {
      phoneNumber: { as: "Phone Number", map: phoneNumberMapper },
    },
    card: {
      name: {
        as: "",
        place: "header",
        tag: "h5",
        className: "card-title",
      },
      phoneNumber: {
        as: "Phone Number",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: phoneNumberMapper,
      },
    },
  },
  projectInputReport: {
    card: {
      name: { as: "Name", place: "header", tag: "h5", className: "card-title" },
      description: {
        as: "Description",
        place: "header",
        className: "card-text",
      },
      createdAt: {
        as: "Creation",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dateMapper,
      },
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
        map: percentageMapper,
      },
      creatorName: {
        as: "Creator",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      coordinatorName: {
        as: "Coordinator",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      coordinatorPhoneNumber: {
        as: "Coordinator Contact",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: phoneNumberMapper,
      },
    },
  },
  projectCostReport: {
    card: {
      cardTitle: {
        place: "header",
        tag: "h5",
        className: "card-title",
        data: "Cost Report",
      },
      projectLaborHours: {
        as: "Total labor hours",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: hourMapper,
      },
      projectHourlyRate: {
        as: "Hourly rate",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: hourlyRateMapper,
      },
      projectLaborCost: {
        as: "Cost of Labor",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
      },
      projectMaterialCost: {
        as: "Cost of Material",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
      },
      projectCost: {
        as: "SubTotal",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
      },
      contingencyCost: {
        as: "Cost of Contingencies",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
      },
      expectedProjectCost: {
        as: "Total Cost",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
      },
    },
  },
  projectProfitReport: {
    card: {
      cardTitle: {
        place: "header",
        tag: "h5",
        className: "card-title",
        data: "Profit Report",
      },
      zipcode: {
        as: "Project Zipcode",
        place: "body",
        tag: "li",
        className: "list-group-item",
      },
      profitMargin: {
        as: "Recommended Profit Margin",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: percentageMapper,
      },
      expectedProfit: {
        as: "Expected Profit",
        place: "body",
        tag: "li",
        className: "list-group-item",
        map: dollarMapper,
      },
    },
  },
};
