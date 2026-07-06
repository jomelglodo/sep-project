import React from "react";
import styles from "./Pagination.module.css";

export default function MainStaffPagination() {
  return (
    <div className={styles.pagination}>
      <button>Previous</button>
      <button>Page 1 of 5</button>
      <button>Next</button>
    </div>
  );
}
