import styles from "./AnnouncementStatysBadge.module.css";

export default function AnnouncementStatusBadge({ isPublished, expiryDate }) {
  let label = "Draft";
  let className = styles.draft;

  if (isPublished) {
    label = "Published";
    className = styles.published;
  }

  if (expiryDate && new Date(expiryDate) < new Date()) {
    label = "Expired";
    className = styles.expired;
  }

  return <span className={`${styles.badge} ${className}`}>{label}</span>;
}
