const categoryConfig = {
  asset: {
    key: "asset",
    title: "Assets",
    singular: "Asset",

    idField: "id",
    nameField: "asset",

    api: {
      getAll: {
        method: "GET",
        url: "/ticketing/mockcategory/assets",
      },

      create: {
        method: "POST",
        url: "/ticketing/category/assets",
      },

      update: {
        method: "PUT",
        url: "/ticketing/category/assets/:id",
      },

      delete: {
        method: "DELETE",
        url: "/ticketing/category/assets/:id",
      },
    },

    fields: [
      {
        name: "asset_name",
        label: "Asset Name",
        type: "text",
        placeholder: "Enter asset name",
        required: true,
        disabled: false,
      },
    ],
  },

  department: {
    key: "department",
    title: "Departments",
    singular: "Department",

    idField: "d_id",
    nameField: "department",

    api: {
      getAll: {
        method: "GET",
        url: "/ticketing/mockcategory/departments",
      },

      create: {
        method: "POST",
        url: "/ticketing/category/departments",
      },

      update: {
        method: "PUT",
        url: "/ticketing/category/departments/:id",
      },

      delete: {
        method: "DELETE",
        url: "/ticketing/category/departments/:id",
      },
    },

    fields: [
      {
        name: "department_name",
        label: "Department Name",
        type: "text",
        placeholder: "Enter department name",
        required: true,
      },
    ],
  },

  section: {
    key: "section",
    title: "Section",
    singular: "Section",

    idField: "section_id",
    nameField: "section_name",

    fields: [
      {
        name: "section_name",
        label: "Section Name",
        type: "text",
        placeholder: "Enter section name",
        required: true,
      },
    ],
  },
};

export default categoryConfig;
