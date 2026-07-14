import { Bell } from "lucide-react";
import { useNotification } from "../../../../../context/ADMIN/IT/Ticketing/NotificationContext";
import styles from "./NotificationBell.module.css";

export default function NotificationBell({ isOpen, onToggle }) {
  const { unreadCount } = useNotification();

  return (
    <div
      className={`${styles.bell_button} ${isOpen ? styles.active : ""}`}
      onClick={onToggle}
    >
      <Bell size={22} />

      {unreadCount > 0 && (
        <span className={styles.badge}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}
