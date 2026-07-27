import styles from "./AnnouncementFilters.module.css";

export default function AnnouncementFilters({ filters, onChange }) {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search announcement..."
        value={filters.search}
        onChange={(e) => {
          onChange((prev) => ({
            ...prev,
            search: e.target.value,
            page: 1,
          }));
        }}
      />
      <select
        value={filters.status}
        onChange={(e) =>
          onChange((prev) => ({
            ...prev,
            status: e.target.value,
            page: 1,
          }))
        }
      >
        <option value="">All Status</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
        <option value="Expired">Expired</option>
      </select>
    </div>
  );
}
