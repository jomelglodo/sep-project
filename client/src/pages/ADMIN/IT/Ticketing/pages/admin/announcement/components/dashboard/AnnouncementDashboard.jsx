import styles from "./AnnouncementDashboard.module.css";

import useAnnouncementDashboard from "../../hooks/useAnnouncementDashboard.js";

import AnnouncementSummaryCards from "./AnnouncementSummaryCards.jsx";
import AnnouncementCategoryChart from "./AnnouncementCategoryChart.jsx";
import RecentAnnouncements from "./RecentAnnouncements.jsx";

export default function AnnouncementDashboard() {
  const {
    summary,
    categorySummary,
    recentAnnouncements,
    loading,
    loadDashboard,
  } = useAnnouncementDashboard();

  if (loading) {
    return (
      <div className={styles.loading}>Loading Announcement Dashboard...</div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Announcement Dashboard</h2>
          <p>Overview and statistics of the announcement system</p>
        </div>
      </div>

      <AnnouncementSummaryCards summary={summary} />
      <AnnouncementCategoryChart data={categorySummary} />
      <RecentAnnouncements announcements={recentAnnouncements} />
    </div>
  );
}
