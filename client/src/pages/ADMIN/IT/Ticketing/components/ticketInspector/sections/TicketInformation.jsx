import styles from "../TicketInspector.module.css";
import { User, Laptop, Tag, Calendar } from "lucide-react";

export default function TicketInformation({ ticket }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <User size={18} />
        <h3>Information</h3>
      </div>

      <div className={styles.info_row}>
        <span>Employee</span>
        <strong>{ticket?.r_name}</strong>
      </div>

      <div className={styles.info_row}>
        <span>Asset</span>
        <strong>{ticket?.asset}</strong>
      </div>

      <div className={styles.info_row}>
        <span>Asset Tag</span>
        <strong>{ticket?.asset_tag}</strong>
      </div>

      <div className={styles.info_row}>
        <span>Created</span>
        <strong>
          {ticket?.date_submitted
            ? new Date(ticket.date_submitted).toLocaleDateString()
            : "-"}
        </strong>
      </div>
    </div>
  );
}
