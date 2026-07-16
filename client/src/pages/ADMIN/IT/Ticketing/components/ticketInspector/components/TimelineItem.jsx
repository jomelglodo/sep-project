import styles from "../TicketInspector.module.css";

import { getTimelineIcon } from "../utils/getTimelineIcon.js";
import { getTimelineColor } from "../utils/getTimelineColor.js";
import formatTimelineTime from "../utils/formatTimelineTime.js";

export default function TimelineItem({ item }) {
  const Icon = getTimelineIcon(item.event_type);
  const color = getTimelineColor(item.event_type);
  const formattedTime = formatTimelineTime(item.created_at);

  return (
    <div className={styles.timeline_item}>
      <div
        className={styles.timeline_icon}
        style={{ color, backgroundColor: `${color}15` }}
      >
        <Icon size={18} />
      </div>
      <div className={styles.timeline_content}>
        <div className={styles.timeline_header}>
          <strong>{item.message}</strong>
        </div>

        {item.performed_by && (
          <div className={styles.timeline_user}>{item.performed_by}</div>
        )}
      </div>
      <div className={styles.timeline_time}>{formattedTime}</div>
    </div>
  );
}
