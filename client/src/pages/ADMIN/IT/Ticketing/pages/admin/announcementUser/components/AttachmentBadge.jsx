import styles from "./AttachmentBadge.module.css";
import { FaPaperclip } from "react-icons/fa";

export default function AttachmentBadge({ count }) {
  if (!Number(count)) return null;

  return (
    <div className={styles.badge}>
      <FaPaperclip />
      <span>
        {count} Attachment{Number(count) > 1 ? "s" : ""}
      </span>
    </div>
  );
}
