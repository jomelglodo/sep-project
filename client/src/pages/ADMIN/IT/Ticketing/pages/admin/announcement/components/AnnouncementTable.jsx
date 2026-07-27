import styles from "./AnnouncementTable.module.css";

import AnnouncementStatusBadge from "./AnnouncementStatusBadge";
import AnnouncementPin from "./AnnouncementPin";
import AnnouncementActions from "./AnnouncementActions";

export default function AnnouncementTable({
  announcements,
  loading,
  onEdit,
  onDelete,
  onTogglePublish,
  onTogglePin,
}) {
  if (loading) {
    return <div className={styles.loading}>Loading announcements...</div>;
  }

  if (!announcements.length) {
    return <div className={styles.empty}>No announcements found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Posted By</th>
              <th>Status</th>
              <th>Pinned</th>
              <th>Attachments</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.announcement_id}>
                <td className={styles.title}>{announcement.title}</td>
                <td>{announcement.category}</td>
                <td>{announcement.posted_name}</td>
                <td>
                  <AnnouncementStatusBadge
                    isPublished={announcement.is_published}
                    expiryDate={announcement.expiry_date}
                  />
                </td>
                <td className={styles.center}>
                  <AnnouncementPin isPinned={announcement.is_pinned} />
                </td>
                <td className={styles.center}>
                  {announcement.attachment_count}
                </td>
                <td>{new Date(announcement.created_at).toLocaleString()}</td>
                <td>
                  <AnnouncementActions
                    announcement={announcement}
                    onEdit={onEdit}
                    onTogglePublish={onTogglePublish}
                    onTogglePin={onTogglePin}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
