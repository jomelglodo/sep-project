import styles from "./CategoryModal.module.css";

import categoryConfig from "../utils/categoryConfig";

import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import CategoryForm from "./CategoryForm";

export default function CategoryModal({ modalState, config, closeModal }) {
  if (!modalState.open) return null;

  /*  const config = categoryConfig[modalState.category]; */

  const { mode } = modalState;
  const { singular } = config;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <ModalHeader mode={mode} title={singular} closeModal={closeModal} />
        <CategoryForm modalState={modalState} config={config} />

        <ModalFooter mode={modalState.mode} closeModal={closeModal} />
      </div>
    </div>
  );
}
