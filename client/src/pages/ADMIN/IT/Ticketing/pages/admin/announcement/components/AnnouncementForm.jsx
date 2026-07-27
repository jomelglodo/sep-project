import { useEffect } from "react";
import styles from "./AnnouncementForm.module.css";
import useAnnouncementForm from "../hooks/useAnnouncementForm.js";

export default function AnnouncementForm({
  loggedinUserId,
  onSuccess,
  announcement = null,
}) {
  const {
    title,
    category,
    content,
    isPublished,
    isPinned,
    expiryDate,
    files,
    setUserId,
    setTitle,
    setCategory,
    setContent,
    setIsPublished,
    setIsPinned,
    setExpiryDate,

    handleFileChange,
    removeFile,
    clearFiles,
    handleSubmit,
  } = useAnnouncementForm({ announcement, onSuccess });

  useEffect(() => {
    setUserId(loggedinUserId);
  }, [loggedinUserId, setUserId]);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* BASIC INFORMATION */}
      <section className={styles.section}>
        <h3>Basic Information</h3>
        <div className={styles.field}>
          <label>User Id : </label>
          <label>{loggedinUserId}</label>
        </div>
        <div className={styles.field}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
          />
        </div>

        <div className={styles.field}>
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Content</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement..."
          ></textarea>
        </div>
      </section>

      {/* PUBLICATION */}
      <section className={styles.section}>
        <h3>Publication Settings</h3>
        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Publish Immediately
          </label>
        </div>

        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            Pin Announcement
          </label>
        </div>

        <div className={styles.field}>
          <label>Expiration Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
      </section>

      {/* ATTACHMENTS */}
      <section className={styles.section}>
        <h3>Attachments</h3>

        <div className={styles.field}>
          <label>Attachments</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}`} className={styles.fileItem}>
              {file.name}

              <button
                className={styles.removeButton}
                type="button"
                onClick={() => removeFile(index)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button type="submit" className={styles.saveButton}>
          {announcement ? "Update Announcement" : "Save Announcement"}
        </button>
        <button type="button" className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
