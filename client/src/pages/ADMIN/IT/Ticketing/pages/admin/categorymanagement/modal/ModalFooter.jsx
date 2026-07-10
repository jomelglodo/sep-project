import styles from "./ModalFooter.module.css";

export default function ModalFooter({
  modalState,
  fortData,
  closeModal,
  onSubmit,
}) {
  const buttonConfig = {
    add: {
      primaryLabel: "Save",
      primaryClass: styles.saveButton,
    },

    edit: {
      primaryLabel: "Update",
      primaryClass: styles.updateButton,
    },

    delete: {
      primaryLabel: "Delete",
      primaryClass: styles.deleteButton,
    },

    view: {
      primaryLabel: "Close",
      primaryClass: styles.closePrimaryButton,
    },
  };

  const { mode } = modalState;

  const config = buttonConfig[mode];

  return (
    <footer className={styles.footer}>
      {mode !== "view" && (
        <button className={styles.cancelButton} onClick={closeModal}>
          Cancel
        </button>
      )}
      <button
        className={config.primaryClass}
        onClick={mode === "view" ? closeModal : onSubmit}
      >
        {config.primaryLabel}
      </button>
    </footer>
  );
}
