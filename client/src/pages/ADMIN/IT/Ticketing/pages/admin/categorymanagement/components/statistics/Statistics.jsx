import styles from "./Statistics.module.css";

//ICONS
import { FaLaptop } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa";

export default function Statistics({ statistics }) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <FaLaptop />

        <div>
          <h2>{statistics.assets}</h2>

          <span>Total Assets</span>
        </div>
      </div>

      <div className={styles.card}>
        <FaBuilding />

        <div>
          <h2>{statistics.departments}</h2>

          <span>Departments</span>
        </div>
      </div>

      <div className={styles.card}>
        <FaLayerGroup />

        <div>
          <h2>{statistics.sections}</h2>

          <span>Sections</span>
        </div>
      </div>
    </div>
  );
}
