import React, { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({
  open,
  title,
  onClose,
  width = "650px",
  children,
  footer,
}) {
  if (!open) return null;

  //EFFETS
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  //Prevent page behind the modal to scroll
  /*   useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]); */
  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_container}
        style={{ width }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.modal_header}>
          <h2>{title}</h2>
          <button className={styles.modal_close} onClick={onClose}>
            x
          </button>
        </div>
        <div className={styles.modal_body}>{children}</div>
        {footer && <div className={styles.modal_footer}>{footer}</div>}
      </div>
    </div>
  );
}
