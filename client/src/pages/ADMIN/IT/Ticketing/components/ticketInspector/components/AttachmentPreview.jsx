import styles from "../TicketInspector.module.css";

import { Image, FileText, FileArchive, Download, Eye } from "lucide-react";

import { getAttachmentIcon } from "../utils/attachmentIcon";
import { getAttachmentType } from "../utils/attachmentType";

export default function AttachmentPreview({ ticket }) {
  const url = `${process.env.REACT_APP_API_URL}${ticket.attachment_url}`;

  const type = getAttachmentType(ticket.attachment_mimetype);
  const Icon = getAttachmentIcon(type);
  return (
    <div className={styles.attachment_container}>
      {type === "image" ? (
        <img
          src={url}
          alt={ticket.attachment_filename}
          className={styles.image_preview}
        />
      ) : (
        <div className={styles.file_preview}>
          <Icon size={70} />
        </div>
      )}

      <div className={styles.filename}>{ticket.attachment_filename}</div>

      <div className={styles.attachment_actions}>
        <button
          onClick={() => window.open(url, "_blank")}
          className={styles.preview_button}
        >
          <Eye size={16} />
          Preview
        </button>
        <a
          href={url}
          download={ticket.attachment_filename}
          className={styles.download_button}
        >
          <Download size={16} /> Download
        </a>
      </div>
    </div>
  );
}
