import styles from "./PinBadge.module.css";
import { FaThumbtack } from "react-icons/fa";

export default function PinBadge() {
  return (
    <div className={styles.badge}>
      <FaThumbtack />
      <span>Pinned</span>
    </div>
  );
}
