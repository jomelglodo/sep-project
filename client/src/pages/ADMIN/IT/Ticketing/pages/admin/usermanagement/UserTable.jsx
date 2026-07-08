import React, { useState } from "react";
import styles from "./UserTable.module.css";

//ICONS
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function MainStaffUserTable({
  users,
  onEdit,
  onView,
  onDelete,
}) {
  return (
    <div className={styles.table_container}>
      <div className={styles.table_wrapper}>
        <table className={styles.user_table}>
          <colgroup>
            <col style={{ width: "90px" }} /> {/* ID */}
            <col />
            {/* Display Name */}
            <col style={{ width: "50px" }} />
            {/* Username */}
            <col style={{ width: "100px" }} />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Display Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th
                style={{
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty_table}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.d_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>
                    <span
                      className={`${styles.role_badge} ${styles[user.role.toLowerCase()]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.status_badge} ${styles[user.status.toLowerCase()]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.last_login}</td>
                  <td className={styles.actions}>
                    {user.role === "admin" ? (
                      <></>
                    ) : (
                      <>
                        <button
                          className={`${styles.action_btn} ${styles.view}`}
                          onClick={() => onView(user)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className={`${styles.action_btn} ${styles.edit}`}
                          onClick={() => onEdit(user)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={`${styles.action_btn} ${styles.delete}`}
                          onClick={() => onDelete(user)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
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
