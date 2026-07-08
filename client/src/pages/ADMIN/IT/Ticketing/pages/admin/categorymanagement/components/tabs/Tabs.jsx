import styles from "./Tabs.module.css";

const tabs = [
  {
    key: "asset",
    label: "Assets",
  },

  {
    key: "department",
    label: "Departments",
  },
];

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={activeTab === tab.key ? styles.active : ""}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
