import React, { useState, useRef, useEffect } from "react";

import styles from "./User_Management.module.css";

//COMPONENTS
import Statistics from "./Statistics";
import SearchFilter from "./SearchFilter";

export default function MainStaffUserManagement() {
  return (
    <div className={styles.usermanagement_container}>
      <div className={styles.usermanagement_header}>
        <h2>User Management</h2>
        <p>Manage system users, roles and access permissions</p>
      </div>
      {/* STATISTICS */}
      <Statistics />
      <SearchFilter />
    </div>
  );
}
