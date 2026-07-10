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

export default function MainAdminCategoryManagement({ displayName }) {
  const [activeTab, setActiveTab] = useState("asset");
  const [search, setSearch] = useState("");
  const { categoryData, loading, error, refreshData } =
    useCategoryData(categoryConfig);

  /*   const currentData = categoryData[activeTab] || []; */
  const currentData = categoryData[activeTab] ?? [];
  const config = categoryConfig[activeTab];

  const statistics = {
    assets: categoryData.asset?.length ?? 0,

    departments: categoryData.department?.length ?? 0,

    sections: categoryData.section?.length ?? 0,
  };

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: crudLoading,
    error: crudError,
  } = useCategoryCRUD({
    refreshData,
  });

  const { modalState, openModal, closeModal } = useCategoryModal();

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
          config={config}
          data={currentData}
          onView={openModal}
          onEdit={openModal}
          onDelete={openModal}
        />
        {/* <Pagination /> */}
      </div>

      <CategoryModal
        modalState={modalState}
        config={config}
        closeModal={closeModal}
        createCategory={createCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        loading={crudLoading}
        error={crudError}
      />
    </>
  );
}
