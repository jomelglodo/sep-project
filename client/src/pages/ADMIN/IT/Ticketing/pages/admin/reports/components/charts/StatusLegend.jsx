import styles from "./StatusLegend.module.css";

const COLORS = {
  Open: "#f59e0b",
  "In Progress": "#3b82f6",
  Hold: "#8b5cf6",
  Closed: "#22c55e",
  Cancelled: "#ef4444",
};

export default function StatusLegend({
  data,
  onSelectedStatus,
  selectedStatus,
}) {
  return (
    <div className={styles.legend}>
      {data.map((item) => (
        <button
          type="button"
          key={item.label}
          className={`${styles.item} ${selectedStatus === item.label ? styles.active : ""}`}
          /*    onMouseEnter={() => onSelectedStatus?.(item)}
          onMouseLeave={() => onSelectedStatus?.(item)} */
          onClick={() => onSelectedStatus?.(item)}
        >
          <div className={styles.left}>
            <span
              className={styles.dot}
              style={{
                backgroundColor: COLORS[item.label] ?? "#94a3b8",
              }}
            />

            <span>{item.label}</span>
          </div>

          <strong>{item.value}</strong>
        </button>
      ))}
    </div>
  );
}
