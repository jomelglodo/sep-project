import { useEffect, useState } from "react";
import styles from "./Category.module.css";

//COMPONENTS
import Statistics from "./components/statistics/Statistics";
import SearchFilter from "./components/searchFilter/SearchFilter";
import Tabs from "./components/tabs/Tabs";
import DataTable from "./components/dataTable/DataTable";
import Pagination from "./components/pagination/Pagination";
import CategoryModal from "./modal/CategoryModal";

//hooks
import useCategoryData from "./hooks/useCategoryData";
import useCategoryCRUD from "./hooks/useCategoryCRUD";
import useCategoryModal from "./hooks/useCategoryModal";
import useCategoryTable from "./hooks/useCategoryTable";
import usePagination from "./hooks/usePagination";

//utils
import categoryConfig from "./utils/categoryConfig";
import buildStatistics from "./utils/buildStatistics";
import { categoryService } from "./services/categoryService";

export default function MainAdminCategoryManagement({ displayName }) {
  const [activeTab, setActiveTab] = useState("asset");
  /*  const [search, setSearch] = useState(""); */

  const { categoryData, loading, error, refreshData } =
    useCategoryData(categoryConfig);

  const assets = categoryData.asset ?? [];
  const departments = categoryData.department ?? [];

  const statistics = buildStatistics(categoryConfig, categoryData);

  const config = categoryConfig[activeTab];
  const rawData = categoryData[activeTab] ?? [];

  const { search, setSearch, filteredData } = useCategoryTable(rawData, config);
  const { currentPage, totalPages, paginatedData, setCurrentPage } =
    usePagination(filteredData);

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
          config={config}
          onAdd={() => {
            openModal("add", activeTab);
          }}
        />
        {/*  <AssetTable assets={assetList} />
      <DepartmentTable departments={departmentList} /> */}
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categoryConfig={categoryConfig}
        />
        <DataTable
          config={config}
          data={paginatedData}
          onView={(item) => openModal("view", activeTab, item)}
          onEdit={(item) => openModal("edit", activeTab, item)}
          onDelete={(item) => openModal("delete", activeTab, item)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
