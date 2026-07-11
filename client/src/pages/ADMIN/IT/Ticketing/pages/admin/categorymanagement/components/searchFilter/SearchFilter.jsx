import styles from "./SearchFilter.module.css";

export default function SearchFilter({ search, setSearch, config, onAdd }) {
  return (
    <div className={styles.wrapper}>
      <input
        placeholder={`Search ${config?.label ?? ""}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={onAdd}>+ Add {config?.label}</button>
    </div>
  );
}
