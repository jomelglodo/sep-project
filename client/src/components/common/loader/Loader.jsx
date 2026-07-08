import styles from "./Loader.module.css";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className={styles.loader_container}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}
