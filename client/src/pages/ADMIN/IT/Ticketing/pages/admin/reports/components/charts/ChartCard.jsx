import styles from "./ChartCard.module.css";

export default function ChartCard({ title, children }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
