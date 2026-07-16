import styles from "./NotificationDropDown.module.css";
import { useNotification } from "../../context/NotificationContext";
import NotificationItem from "./NotificationItem";

export default function NotificationDropDown() {
  const { notifications, loading, unreadCount, handleMarkAllAsRead } =
    useNotification();

  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <h4>Notifications </h4>
        {unreadCount > 0 && (
          <button
            disabled={!unreadCount}
            className={styles.mark_all}
            onClick={handleMarkAllAsRead}
          >
            Mark all
          </button>
        )}
      </div>

      <div className={styles.body}>
        {loading ? (
          <div className={styles.loading}>Loading....</div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>No notifications</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
            />
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>View All</div>
    </div>
  );
}
