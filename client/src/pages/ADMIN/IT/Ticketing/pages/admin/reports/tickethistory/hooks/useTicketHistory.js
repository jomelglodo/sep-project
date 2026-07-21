import { useEffect, useState } from "react";
import { getTicketHistory } from "../../services/reportingService.js";

export default function useTicketHistory(filters) {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [
    filters.page,
    filters.limit,
    filters.status,
    filters.department,
    filters.search,
    filters.staff,
  ]);

  async function loadHistory() {
    try {
      setLoading(true);

      const result = await getTicketHistory(filters);
      setTickets(result.tickets);
      setPagination(result.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    tickets,
    pagination,
    loading,
    refresh: loadHistory,
  };
}
