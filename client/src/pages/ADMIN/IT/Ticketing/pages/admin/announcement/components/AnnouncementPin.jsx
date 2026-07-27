import { FaThumbtack } from "react-icons/fa";

import styles from "./AnnouncementPin.module.css";

export default function AnnouncementPin({ isPinned }) {
  if (!isPinned) {
    return <span className={styles.notPinned}>-</span>;
  }

  return (
    <div className={styles.pinned}>
      <FaThumbtack />
      <span>Pinned</span>
    </div>
  );
}
