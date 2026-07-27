import { FaEllipsisV } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

import styles from "./AnnouncementActions.module.css";

export default function AnnouncementActions({
  announcement,
  onEdit,
  onTogglePublish,
  onTogglePin,
  onDelete,
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={menuRef}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        <FaEllipsisV />
      </button>

      {open && (
        <div className={styles.menu}>
          <button
            onClick={() => {
              setOpen(false);
              onEdit(announcement);
            }}
          >
            ✏ Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onTogglePublish(announcement);
            }}
          >
            {announcement.is_published ? "🌐 Unpublish" : "🌐 Publish"}
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onTogglePin(announcement);
            }}
          >
            {announcement.is_pinned ? "📌 Unpin" : "📌 Pin"}
          </button>

          <button
            className={styles.delete}
            onClick={() => {
              setOpen(false);
              onDelete(announcement);
            }}
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}
