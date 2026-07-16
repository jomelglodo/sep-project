import styles from "../TicketInspector.module.css";
import { FileText } from "lucide-react";

export default function TicketSubject({ ticket }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <FileText size={18} />
        <h3>Subject</h3>
      </div>

      <p>{ticket?.subject_title}</p>
    </div>
  );
}
