import styles from "./AnnouncementSearch.module.css";

export default function AnnouncementSearch({ search, onChange }) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search announcements..."
        value={search}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
