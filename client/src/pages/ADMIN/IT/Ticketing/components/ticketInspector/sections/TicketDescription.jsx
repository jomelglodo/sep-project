import styles from "../TicketInspector.module.css";
import { AlignLeft } from "lucide-react";

export default function TicketDescription({ ticket }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <AlignLeft size={18} />
        <h3>Description</h3>
      </div>

      <p>{ticket?.description}</p>
    </div>
  );
}
