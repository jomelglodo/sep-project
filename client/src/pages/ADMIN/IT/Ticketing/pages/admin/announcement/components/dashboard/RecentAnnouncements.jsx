import styles from "./RecentAnnouncements.module.css";

import AnnouncementStatusBadge from "../AnnouncementStatusBadge";
import AnnouncementPin from "../AnnouncementPin";

export default function RecentAnnouncements({ announcements }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Recent Announcements</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Posted By</th>
            <th>Status</th>
            <th>Pinned</th>
            <th>Published</th>
          </tr>
        </thead>

        <tbody>
          {announcements.map((announcement) => (
            <tr key={announcement.announcement_id}>
              <td>{announcement.title}</td>
              <td>{announcement.category}</td>
              <td>{announcement.posted_by}</td>
              <td>
                <AnnouncementStatusBadge
                  isPublished={announcement.is_published}
                />
              </td>
              <td>
                <AnnouncementPin isPinned={announcement.is_pinned} />
              </td>
              <td>
                {announcement.publish_date
                  ? new Date(announcement.publish_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
