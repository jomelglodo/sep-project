import { FaTimes } from "react-icons/fa";

import styles from "./CategoryModal.module.css";

const titles = {
  add: "Add",
  edit: "Edit",
  view: "View",
  delete: "Delete",
};

export default function ModalHeader({ mode, title, closeModal }) {
  return (
    <header className={styles.header}>
      <h2>
        {titles[mode]} {title}
      </h2>

      <button className={styles.closeButton} onClick={closeModal}>
        <FaTimes />
      </button>
    </header>
  );
}
