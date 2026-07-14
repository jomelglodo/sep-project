import styles from "./NotificationItem.module.css";
import { getNotificationIcon } from "./utils/notificationIcons.js";
import { getNotificationColor } from "./utils/notificationColor.js";

import { useNotification } from "../../../../../context/ADMIN/IT/Ticketing/NotificationContext.jsx";

import formatNotificationTime from "./utils/formatNotificationTime.js";

export default function NotificationItem({ notification }) {
  const Icon = getNotificationIcon(notification.notification_type);
  const color = getNotificationColor(notification.notification_type);

  //format notification time
  const formattedTime = formatNotificationTime(notification.created_at);
  const { handleMarkAsRead } = useNotification();
  return (
    <div
      className={`${styles.item} ${!notification.is_read ? styles.unread : ""}`}
    >
      <div className={styles.icon_container}>
        {!notification.is_read && <span className={styles.dot} />}

        <div
          className={styles.icon}
          style={{
            color,
            backgroundColor: `${color}15`,
          }}
        >
          <Icon size={18} />
        </div>
      </div>

      <div
        className={styles.content}
        onClick={() => {
          if (!notification.is_read) {
            handleMarkAsRead(notification.notification_id);
          }
        }}
      >
        <div className={styles.title}>{notification.title}</div>
        <div className={styles.message}>{notification.message}</div>
        <div className={styles.time}>{formattedTime}</div>
      </div>
    </div>
  );
}
