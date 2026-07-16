import styles from "../TicketInspector.module.css";
import { Paperclip } from "lucide-react";

import AttachmentPreview from "../components/AttachmentPreview";

export default function TicketAttachment({ ticket }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <Paperclip size={18} />
        <h3>Attachment</h3>
      </div>
      {!ticket?.attachment_url ? (
        <div className={styles.noattachment}>No attachment uploaded</div>
      ) : (
        <AttachmentPreview ticket={ticket} />
      )}
    </div>
  );
}
