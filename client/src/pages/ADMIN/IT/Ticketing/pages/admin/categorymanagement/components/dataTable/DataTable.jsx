import styles from "./DataTable.module.css";
/* import { tableColumns } from "../../utils/columns"; */

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function DataTable({ config, data, onView, onEdit, onDelete }) {
  /* const columns = tableColumns[config.nameField]; */
  const columns = config.columns;
  return (
    <div className={styles.table_container}>
      <div className={styles.table_header}>
        <h3>{config.title} List</h3>

        <span>{data.length} Records</span>
      </div>

      <div className={styles.table_wrapper}>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className={styles.empty} colSpan={columns.length + 1}>
                  No {config.plural} Found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item[config.idField]}>
                  {columns.map((column) => (
                    <td key={column.key}>{item[column.key]}</td>
                  ))}

                  <td className={styles.actions}>
                    <button
                      className={`${styles.btn} ${styles.view}`}
                      onClick={() => onView(item)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className={`${styles.btn} ${styles.edit}`}
                      onClick={() => onEdit(item)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className={`${styles.btn} ${styles.delete}`}
                      onClick={() => onDelete(item)}
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
