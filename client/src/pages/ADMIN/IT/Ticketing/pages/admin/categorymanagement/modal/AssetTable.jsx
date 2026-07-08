import styles from "./AssetTable.module.css";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function AssetTable({ assets, onView, onEdit, onDelete }) {
  return (
    <div className={styles.table_container}>
      <div className={styles.table_header}>
        <h3>Assets</h3>
        <span>{assets.length} Records</span>
      </div>
      <div className={styles.table_wrapper}>
        <table className={styles.asset_table}>
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
              <th>Asset</th>
              <th>Description</th>
              <th>Created By</th>
              <th className={styles.actions_header}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty_table}>
                  Asset Found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.id}</td>
                  <td>{asset.asset}</td>
                  <td>{asset.description}</td>
                  <td>{asset.created_by}</td>
                  <td className={styles.actions}>
                    <button
                      className={`${styles.action_btn} ${styles.view}`}
                      onClick={() => onView(asset)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className={`${styles.action_btn} ${styles.edit}`}
                      onClick={() => onEdit(asset)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`${styles.action_btn} ${styles.delete}`}
                      onClick={() => onDelete(asset)}
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
