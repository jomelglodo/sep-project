import styles from "./AnnouncementCard.module.css";

import AttachmentBadge from "./AttachmentBadge";
import PinBadge from "./PinBadge";

export default function AnnouncementCard({ announcement, onReadMore }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{announcement.title}</h3>
        {announcement.is_pinned && <PinBadge />}
      </div>

      <div className={styles.meta}>
        <span>{announcement.category}</span>
        <span>{announcement.posted_by}</span>

        <span>{new Date(announcement.publish_date).toLocaleDateString()}</span>
      </div>

      <p className={styles.preview}>
        {announcement.content.slice(0, 180)}
        {announcement.content.length > 180 && "..."}
      </p>

      <div className={styles.footer}>
        <AttachmentBadge count={announcement.attachment_count} />
        <button onClick={() => onReadMore(announcement)}>Read More</button>
      </div>
    </div>
  );
}
