import Modal from "../modal/Modal";
import styles from "./ViewUserModal.module.css";

export default function MainAdminViewUserModal({ open, user, onClose }) {
  if (!user) return null;
  return (
    <Modal
      open={open}
      title="User Details"
      width="700px"
      onClose={onClose}
      footer={
        <button className={styles.primary_btn} onClick={onClose}>
          Close
        </button>
      }
    >
      <div className={styles.view_user}>
        <div className={styles.profile_header}>
          <div className={styles.avatar}>
            {user.displayname
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
          </div>

          <h2>{user.fullname}</h2>

          <p>{user.role}</p>
        </div>

        <div className={styles.section}>
          <h3>Personal Information</h3>
          <div className={styles.info_grid}>
            <div>
              <label>Full Name</label>

              <p>{user.displayname}</p>
            </div>

            <div>
              <label>Username</label>

              <p>{user.username}</p>
            </div>

            <div>
              <label>Email</label>

              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <h3>Account Information</h3>

          <div className={styles.info_grid}>
            <div>
              <label>Department</label>

              <p>{user.department}</p>
            </div>

            <div>
              <label>Role</label>

              <p>{user.role}</p>
            </div>

            <div>
              <label>Status</label>

              <span
                className={`${styles.status_badge} ${styles[user.status.toLowerCase()]}`}
              >
                {user.status}
              </span>
            </div>

            <div>
              <label>Last Login</label>

              <p>{user.lastLogin}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
