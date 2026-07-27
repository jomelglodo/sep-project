import styles from "./AnnouncementList.module.css";

import AnnouncementCard from "./AnnouncementCard";

export default function AnnouncementList({
  loading,
  announcement,
  onReadMore,
}) {
  if (loading) {
    return <div className={styles.message}>Loading announcements...</div>;
  }

  if (!announcement.length) {
    return <div className={styles.message}>No announcements available..</div>;
  }

  return (
    <div className={styles.list}>
      <div className={styles.wrapper}>
        {announcement.map((announcement) => (
          <AnnouncementCard
            key={announcement.announcement_id}
            announcement={announcement}
            onReadMore={onReadMore}
          />
        ))}
      </div>
    </div>
  );
}
