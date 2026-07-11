import styles from "./Tabs.module.css";

export default function Tabs({ activeTab, setActiveTab, categoryConfig }) {
  return (
    <div className={styles.tabs}>
      {Object.entries(categoryConfig).map(([key, config]) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={activeTab === key ? styles.active : ""}
        >
          {config.plural}
        </button>
      ))}
    </div>
  );
}
