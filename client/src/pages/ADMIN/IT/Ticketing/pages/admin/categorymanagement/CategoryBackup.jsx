import { useEffect, useState } from "react";
import styles from "./Category.module.css";

//COMPONENTS
import Statistics from "./components/statistics/Statistics";
import SearchFilter from "./components/searchFilter/SearchFilter";
import Tabs from "./components/tabs/Tabs";
import DataTable from "./components/dataTable/DataTable";
import Pagination from "./components/pagination/Pagination";
import CategoryModal from "./modal/CategoryModal";

import useCategoryData from "./hooks/useCategoryData";
import useCategoryCRUD from "./hooks/useCategoryCRUD";
import useCategoryModal from "./hooks/useCategoryModal";

import categoryConfig from "./utils/categoryConfig";
/* import AssetTable from "./modal/AssetTable";
import DepartmentTable from "./modal/DepartmentTable"; */

export default function MainAdminCategoryManagement({ displayName }) {
  const API = process.env.REACT_APP_API_URL;
  const [activeTab, setActiveTab] = useState("asset");
  const [search, setSearch] = useState("");
  /*  const [assetList, setAssetList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [sectionList] = useState([]); */
  const { categoryData, loading, error, refreshData } =
    useCategoryData(categoryConfig);

  const statistics = {
    assets: assetList.length,
    departments: departmentList.length,
    sections: sectionList.length,
  };

  /*   const categoryData = {
    asset: assetList,
    department: departmentList,
  }; */

  /*   const {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: crudLoading,
    error: crudError,
  } = useCategoryCRUD({
    refreshData,
  }); */

  //callback
  /*  const { modalState, openModal, closeModal } = useCategoryModal(); */

  /*  const { categoryData, loading, refreshData } = useCategoryData(); */

  const { modalState, openModal, closeModal } = useCategoryModal();

  /* const {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: crudLoading,
  } = useCategoryCRUD({
    refreshData,
  }); */

  const currentConfig = modalState.category
    ? categoryConfig[modalState.category]
    : null;

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAssets(), fetchDepartments()]);
    };
    loadData();
  }, []);

  //API
  //fetch assets
  const fetchAssets = async () => {
    try {
      const response = await fetch(`${API}/ticketing/mockcategory/assets`);

      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }

      const data = await response.json();
      setAssetList(data);
    } catch (err) {
      console.error(err);
    }
  };
  //fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API}/ticketing/mockcategory/departments`);

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();
      setDepartmentList(data);
    } catch (err) {
      console.error(err);
    }
  };

  //HANDLER FUNCTION
  const handleView = (row) => {
    openModal("view", activeTab, row);
  };

  const handleEdit = (row) => {
    openModal("edit", activeTab, row);
  };

  const handleDelete = (row) => {
    openModal("delete", activeTab, row);
  };

  return (
    <>
      <div className={styles.category_container}>
        <div className={styles.header}>
          <h2>Category Management</h2>
          <p>
            Manage assets and departments used throughout the ticketing system
          </p>
        </div>
        {/* STATISTICS */}
        <Statistics statistics={statistics} />
        <SearchFilter
          search={search}
          setSearch={setSearch}
          activeTab={activeTab}
          onAdd={() => {
            openModal("add", activeTab);
          }}
        />
        {/*  <AssetTable assets={assetList} />
      <DepartmentTable departments={departmentList} /> */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <DataTable
          activeTab={activeTab}
          dataList={categoryData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {/* <Pagination /> */}
      </div>

      <CategoryModal
        modalState={modalState}
        config={currentConfig}
        closeModal={closeModal}
      />
    </>
  );
}
