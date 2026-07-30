import { useEffect, useState } from "react";

import {
  getAnnouncementDashboard,
  getAnnouncementCategorySummary,
  getRecentAnnouncements,
} from "../services/announcementDashboardService.js";

export default function useAnnouncementDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorySummary, setCategorySummary] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [summary, categories, recent] = await Promise.all([
        getAnnouncementDashboard(),
        getAnnouncementCategorySummary(),
        getRecentAnnouncements(),
      ]);

      setSummary(summary);
      setCategorySummary(categories);
      setRecentAnnouncements(recent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    summary,
    categorySummary,
    recentAnnouncements,
    loading,
    loadDashboard,
  };
}
