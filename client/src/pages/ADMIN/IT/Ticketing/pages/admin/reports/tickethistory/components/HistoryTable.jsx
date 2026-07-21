import styles from "./HistoryTable.module.css";
import StatusBadge from "../common/StatusBadge";

export default function HistoryTable({ tickets, loading, onTicketClick }) {
  if (loading) {
    return <div className={styles.loading}>Loading tickets...</div>;
  }

  if (!tickets.length) {
    return <div className={styles.empty}>No ticket found</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Staff</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                onClick={() => onTicketClick?.(ticket.ticket_id)}
                className={styles.row}
              >
                <td>{ticket.ticket_num}</td>
                <td>{ticket.r_name}</td>
                <td>{ticket.department}</td>
                <td>{ticket.subject_title}</td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>{ticket.staff_name ?? "-"}</td>
                <td>{new Date(ticket.date_submitted).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
