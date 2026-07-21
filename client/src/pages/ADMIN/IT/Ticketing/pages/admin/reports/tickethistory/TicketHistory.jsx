import { useState } from "react";
import styles from "./TicketHistory.module.css";
import { useTicketInspector } from "../../../../context/TicketInspectorContext.jsx";
import { exportTicketHistory } from "../services/reportingService.js";

import { toast } from "react-toastify";

//COMPONENTS
import HistoryFilters from "./components/HistoryFilters";
import HistoryTable from "./components/HistoryTable";
import Pagination from "./components/Pagination.jsx";

import useTicketHistory from "./hooks/useTicketHistory.js";

import { DEFAULT_HISTORY_FILTERS } from "../constants/reportingConstants.js";

export default function TicketHistory() {
  const { openTicket } = useTicketInspector();
  const [filters, setFilters] = useState(DEFAULT_HISTORY_FILTERS);
  const { tickets, pagination, loading } = useTicketHistory(filters);

  function handleTicketClick(ticketId) {
    openTicket(ticketId);
  }

  function updateFilter(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  }

  function resetFilters() {
    setFilters(DEFAULT_HISTORY_FILTERS);
  }

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

  async function handleExport() {
    try {
      const response = await exportTicketHistory(filters);
      const blob = response.data;

      const disposition = response.headers["content-disposition"];

      let filename = "Ticket_History.xlsx";

      if (disposition) {
        const match = disposition.match(/filename="(.+?)"?$/);

        if (match) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report.");
    }
  }

  return (
    <div className={styles.container}>
      <HistoryFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />
      <button onClick={handleExport}>Export Excel</button>
      <HistoryTable
        tickets={tickets}
        loading={loading}
        onTicketClick={handleTicketClick}
      />
      <Pagination
        page={filters.page}
        totalPages={pagination?.totalpages ?? 1}
        pageSize={filters.limit}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
      />
    </div>
  );
}
