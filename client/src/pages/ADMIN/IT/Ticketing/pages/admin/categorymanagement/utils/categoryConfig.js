import { FaLaptop } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa";

const categoryConfig = {
  asset: {
    key: "asset",
    title: "Assets",
    label: "Asset",
    singular: "Asset",
    plural: "Assets",
    statisticsLabel: "Total Assets",
    icon: FaLaptop,

    idField: "id",
    nameField: "asset",

    searchFields: ["asset", "created_by"],

    api: {
      getAll: {
        method: "GET",
        url: "/ticketing/mockcategory/assets",
      },

      create: {
        method: "POST",
        url: "/ticketing/category/assets",
        successMessage: "Asset created successfully.",
      },

      update: {
        method: "PUT",
        url: "/ticketing/category/assets/:id",
        successMessage: "Asset updated successfully.",
      },

      delete: {
        method: "DELETE",
        url: "/ticketing/category/assets/:id",
        successMessage: "Asset deleted successfully.",
      },
    },
    columns: [
      {
        key: "id",
        label: "ID",
      },
      {
        key: "asset",
        label: "Asset Name",
      },

      {
        key: "created_by",
        label: "Created By",
      },
    ],
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
    label: "Department",
    singular: "Department",
    plural: "Departments",
    statisticsLabel: "Total Departments",
    icon: FaBuilding,

    idField: "d_id",
    nameField: "department",

    searchFields: ["department"],
    api: {
      getAll: {
        method: "GET",
        url: "/ticketing/mockcategory/departments",
      },

      create: {
        method: "POST",
        url: "/ticketing/category/departments",
        successMessage: "Department created successfully.",
      },

      update: {
        method: "PUT",
        url: "/ticketing/category/departments/:id",
        successMessage: "Department updated successfully.",
      },

      delete: {
        method: "DELETE",
        url: "/ticketing/category/departments/:id",
        successMessage: "Department deleted successfully.",
      },
    },
    columns: [
      {
        key: "d_id",
        label: "ID",
      },
      {
        key: "department",
        label: "Department",
      },

      {
        key: "created_by",
        label: "Created By",
      },
    ],
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
};

export default categoryConfig;
