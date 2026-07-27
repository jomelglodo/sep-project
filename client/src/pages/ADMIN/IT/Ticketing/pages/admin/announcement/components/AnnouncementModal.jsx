import styles from "./AnnouncementModal.module.css";

export default function AnnouncementModal({ title, children, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.close} onClick={onClose}>
            x
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
