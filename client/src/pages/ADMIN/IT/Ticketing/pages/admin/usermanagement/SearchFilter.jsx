import { useEffect } from "react";
import styles from "./SearchFilter.module.css";

export default function AdminSearchFilter({ onAdd, department, role, status }) {
  return (
    <div className={styles.search_filter}>
      <input type="text" placeholder="Search by name, email, or username...." />
      <select name="" id="">
        <option value="">All Roles</option>
        {role.map((item, index) => (
          <option key={index} value={item.role}>
            {item.role}
          </option>
        ))}
      </select>
      <select name="" id="">
        <option value="">All Deparment</option>
        {department.map((item, index) => (
          <option key={index} value={item.department}>
            {item.department}
          </option>
        ))}
      </select>
      <select name="" id="">
        <option value="">All Status</option>
        {status.map((item, index) => (
          <option key={index} value={item.status}>
            {item.status}
          </option>
        ))}
      </select>
      <button onClick={onAdd}>+ Add New User</button>
    </div>
  );
}
