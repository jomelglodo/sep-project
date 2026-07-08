import styles from "./SearchFilter.module.css";

export default function SearchFilter({ search, setSearch, activeTab, onAdd }) {
  return (
    <div className={styles.wrapper}>
      <input
        placeholder={`Search ${activeTab}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={onAdd}>+ Add {activeTab}</button>
    </div>
  );
}
