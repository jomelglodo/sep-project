import styles from "./AnnouncementToolbar.module.css";

export default function AnnouncementToolbar({ onCreate }) {
  return (
    <div className={styles.toolbar}>
      <h2>Announcement Management</h2>
      <button onClick={onCreate}>Create Announcement</button>
    </div>
  );
}
