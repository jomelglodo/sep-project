import styles from "./AnnouncementViewerModal.module.css";

import {
  downloadAnnouncementFile,
  getPreviewUrl,
} from "../services/announcementUserService.js";
import { useState } from "react";

export default function AnnouncementViewerModal({ announcement, onClose }) {
  const [previewImage, setPreviewImage] = useState(null);
  //handle downloadfile
  async function handleDownload(fileId) {
    try {
      const { blob, filename } = await downloadAnnouncementFile(fileId);

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
    }
  }

  //helper function
  function handleOpenFile(file) {
    if (file.file_type.startsWith("image/")) {
      setPreviewImage(getPreviewUrl(file.file_id));

      return;
    }

    if (file.file_type === "application/pdf") {
      window.open(getPreviewUrl(file.file_id), "_blank", "noopener,noreferrer");

      return;
    }

    handleDownload(file.file_id);
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <h2>{announcement.title}</h2>

        <div className={styles.meta}>
          <span>{announcement.category}</span>

          <span>{announcement.posted_by}</span>

          <span>
            {new Date(announcement.publish_date).toLocaleDateString()}
          </span>
        </div>

        <div className={styles.content}>{announcement.content}</div>

        {!!announcement.files.length && (
          <>
            <h3>Attachments</h3>

            <div className={styles.files}>
              {announcement.files.map((file) => (
                <div key={file.file_id} className={styles.file}>
                  <span>{file.original_filename}</span>

                  <button onClick={() => handleOpenFile(file)}>
                    {file.file_type.startsWith("image/")
                      ? "Preview"
                      : file.file_type === "application/pdf"
                        ? "Open"
                        : "Download"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {previewImage && (
          <div className={styles.imageOverlay}>
            <div className={styles.imageContainer}>
              <button
                onClick={() => setPreviewImage(null)}
                className={styles.closeImage}
              >
                ✕
              </button>

              <img src={previewImage} alt="Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
