import { useEffect, useState } from "react";

import { getAnnouncements } from "../services/announcementService.js";

export default function useAnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    page: 1,
    limit: 10,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  //helper function
  function changePage(page) {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }

  function changePageSize(limit) {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.search]);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const data = await getAnnouncements({
        ...filters,
        search: debouncedSearch,
      });

      setAnnouncements(data.announcements);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, [
    debouncedSearch,
    filters.category,
    filters.status,
    filters.page,
    filters.limit,
  ]);

  return {
    announcements,
    loading,
    pagination,

    filters,
    setFilters,

    changePage,
    changePageSize,

    loadAnnouncements,
  };
}
