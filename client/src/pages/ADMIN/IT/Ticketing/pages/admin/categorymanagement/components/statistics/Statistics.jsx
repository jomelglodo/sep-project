import styles from "./Statistics.module.css";

export default function Statistics({ statistics }) {
  return (
    <div className={styles.grid}>
      {statistics.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.key} className={styles.card}>
            <Icon />

            <div>
              <h2>{item.count}</h2>

              <span> {item.statisticsLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
