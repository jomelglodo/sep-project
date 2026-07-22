import { useEffect } from "react";
import styles from "./AnnouncementForm.module.css";
import useAnnouncementForm from "../hooks/useAnnouncementForm.js";

export default function AnnouncementForm({ loggedinUserId }) {
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
  } = useAnnouncementForm();

  useEffect(() => {
    setUserId(loggedinUserId);
  }, [loggedinUserId]);

  return (
    <form
      className={styles.container}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
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
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
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
      <div className={styles.options}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.value)}
          />
          Publish Immediately
        </label>
      </div>

      <div className={styles.options}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.value)}
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
      <div className={styles.actions}>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
        <button type="button" className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
