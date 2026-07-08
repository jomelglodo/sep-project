import Modal from "../modal/Modal";
import { FaExclamation } from "react-icons/fa";

import styles from "./DeleteUserModal.module.css";

export default function MainAdminDeleteUser({ open, user, onClose, onDelete }) {
  if (!user) return null;

  const handleDelete = () => {
    onDelete(user.user_id);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Delete User"
      width="500px"
      onClose={onClose}
      footer={
        <>
          <button className={styles.secondary_btn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.danger_btn} onClick={handleDelete}>
            Delete User
          </button>
        </>
      }
    >
      <div className={styles.delete_user}>
        <div className={styles.warning_icon}>
          <FaExclamation />
        </div>
        <h2>Delete "{user.d_name}"</h2>
        <p>This action cannot be undone</p>
        <div className={styles.delete_summary}>
          <div>
            <strong>Username</strong>
            <span>{user.username}</span>
          </div>
          <div>
            <strong>Email</strong>
            <span>{user.email}</span>
          </div>
          <div>
            <strong>Role</strong>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
