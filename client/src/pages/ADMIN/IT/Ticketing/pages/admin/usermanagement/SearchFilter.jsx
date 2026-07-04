import styles from "./SearchFilter.module.css";

export default function AdminSearchFilter() {
  return (
    <div className={styles.search_filter}>
      <input type="text" placeholder="Search by name, email, or username...." />
      <select name="" id="">
        <option value="">All Roles</option>
      </select>
      <select name="" id="">
        <option value="">All Deparment</option>
      </select>
      <select name="" id="">
        <option value="">All Status</option>
      </select>
      <button>+ Add New User</button>
    </div>
  );
}
