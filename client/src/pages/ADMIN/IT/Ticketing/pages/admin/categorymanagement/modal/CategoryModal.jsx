import styles from "./CategoryModal.module.css";
import { toast } from "react-toastify";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import CategoryForm from "./CategoryForm";
import { useEffect, useState } from "react";

import toastSuccessSound from "../../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";

export default function CategoryModal({
  modalState,
  config,
  closeModal,
  createCategory,
  updateCategory,
  deleteCategory,
  loading,
  error,
}) {
  const toastSuccessAudio = new Audio(toastSuccessSound);
  const { open, mode, data } = modalState;
  const [formData, setFormData] = useState({});

  /* const config = categoryConfig[modalState.category]; */

  useEffect(() => {
    if (!config) return;

    if (data) {
      setFormData(data);
      return;
    }

    const initialData = {};

    config.fields.forEach((field) => {
      initialData[field.name] = "";
    });

    setFormData(initialData);
  }, [config, data]);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflowY = "scroll"; // always show scrollbar
      document.body.style.overflow = "hidden"; // disable scrolling
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflowY = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflowY = "";
    };
  }, [open]);

  if (!open || !config) return null;

  const { singular } = config;

  //HANDLER

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitHandlers = {
      add: () => createCategory(config, formData),
      edit: () => updateCategory(config, data[config.idField], formData),
      delete: () => deleteCategory(config, data[config.idField]),
    };

    const success = await submitHandlers[mode]?.();

    if (success) {
      const messages = {
        add: `${config.singular} created successfully.`,
        edit: `${config.singular} updated successfully.`,
        delete: `${config.singular} deleted successfully.`,
      };
      toastSuccessAudio.play();
      toast.success(messages[mode]);
      closeModal();
    }
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <ModalHeader mode={mode} title={singular} closeModal={closeModal} />
        <CategoryForm
          modalState={modalState}
          config={config}
          formData={formData}
          setFormData={setFormData}
        />

        <ModalFooter
          modalState={modalState}
          formData={formData}
          closeModal={closeModal}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
