import styles from "./DepartmentTable.module.css";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function DepartmentTable({
  departments,
  onView,
  onDelete,
  onEdit,
}) {
  return (
    <div className={styles.table_container}>
      <div className={styles.table_header}>
        <h3>Department List</h3>
        <span>{departments.length} Records</span>
      </div>
      <div className={styles.table_wrapper}>
        <table>
          <colgroup>
            <col style={{ width: "90px" }} />
            <col />
            <col />
            <col style={{ width: "180px" }} />
            <col style={{ width: "120px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Description</th>
              <th>Created By</th>
              <th className={styles.actions_header}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty_table}>
                  No Departments Found
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.d_id}>
                  <td>{department.d_id}</td>
                  <td>{department.department}</td>
                  <td>{department.description}</td>
                  <td>{department.created_by}</td>
                  <td className={styles.actions}>
                    <button
                      className={`${styles.action_btn} ${styles.view}`}
                      onClick={() => onView(department)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className={`${styles.action_btn} ${styles.edit}`}
                      onClick={() => onView(department)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`${styles.action_btn} ${styles.delete}`}
                      onClick={() => onView(department)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
