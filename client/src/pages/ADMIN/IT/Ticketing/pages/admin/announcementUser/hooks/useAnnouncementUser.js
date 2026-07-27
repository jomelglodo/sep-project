import { useEffect, useState } from "react";

import {
  getUserAnnouncement,
  getAnnouncementDetails,
} from "../services/announcementUserService.js";

export default function useAnnouncementUser() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, [search, category]);

  async function loadAnnouncements() {
    try {
      setLoading(true);

      const response = await getUserAnnouncement({ search, category });
      setAnnouncements(response.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function openAnnouncements(announcement) {
    try {
      const details = await getAnnouncementDetails(
        announcement.announcement_id,
      );

      setSelectedAnnouncement(details);
    } catch (err) {
      console.error(err);
    }
  }

  function closeAnnouncement() {
    setSelectedAnnouncement(null);
  }

  return {
    announcements,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    selectedAnnouncement,
    openAnnouncements,
    closeAnnouncement,
    loadAnnouncements,
  };
}
