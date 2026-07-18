import styles from "./SummaryCard.module.css";
import SummaryCard from "./SummaryCard";

import {
  FaTicketAlt,
  FaFolderOpen,
  FaSpinner,
  FaCheckCircle,
  FaBan,
  FaCalendarDay,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

export default function SummaryCards({ summary }) {
  const cards = [
    {
      title: "Total Tickets",
      subtitle: "All submitted tickets",
      value: summary.total_tickets ?? 0,
      icon: FaTicketAlt,
      color: "#2563eb",
    },
    {
      title: "Open",
      subtitle: "Waiting for action",
      value: summary.open_tickets ?? 0,
      icon: FaFolderOpen,
      color: "#f59e0b",
    },
    {
      title: "In Progress",
      subtitle: "",
      value: summary.in_progress_tickets ?? 0,
      icon: FaSpinner,
      color: "#3b82f6",
    },
    {
      title: "Closed",
      subtitle: "Successfully resolved",
      value: summary.closed_tickets ?? 0,
      icon: FaCheckCircle,
      color: "#22c55e",
    },
    {
      title: "Cancelled",
      subtitle: "",
      value: summary.cancelled_tickets ?? 0,
      icon: FaBan,
      color: "#ef4444",
    },
    {
      title: "Today",
      subtitle: "",
      value: summary.today_tickets ?? 0,
      icon: FaCalendarDay,
      color: "#8b5cf6",
    },
    {
      title: "This Month",
      subtitle: "",
      value: summary.this_month_tickets ?? 0,
      icon: FaCalendarAlt,
      color: "#0ea5e9",
    },
    {
      title: "Average Resolution",
      subtitle: "",
      value: summary.average_resolution_hours ?? 0,
      icon: FaClock,
      color: "#14b8a6",
    },
  ];
  return (
    <div className={styles.summary_grid}>
      {cards.map((card) => (
        <SummaryCard key={card.title} card={card} />
      ))}
    </div>
  );
}
