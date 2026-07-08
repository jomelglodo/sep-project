import { useEffect } from "react";
import styles from "./SearchFilter.module.css";

export default function AdminSearchFilter({
  onAdd,
  department,
  role,
  status,
  filters,
  setFilters,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className={styles.search_filter}>
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by display name, department or username...."
      />
      <select name="role" value={filters.role} onChange={handleChange}>
        <option value="">All Roles</option>
        {role.map((item, index) => (
          <option key={index} value={item.role}>
            {item.role}
          </option>
        ))}
      </select>
      <select
        name="department"
        value={filters.department}
        onChange={handleChange}
      >
        <option value="">All Deparment</option>
        {department.map((item, index) => (
          <option key={index} value={item.department}>
            {item.department}
          </option>
        ))}
      </select>
      <select name="status" value={filters.status} onChange={handleChange}>
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
