import styles from "./CategoryModal.module.css";

import categoryConfig from "../utils/categoryConfig";

import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import CategoryForm from "./CategoryForm";
import { useEffect, useState } from "react";

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !config) return null;

  const { singular } = config;

  //HANDLER
  /*   const handleSubmit = () => {
    console.log(formData);
  }; */
  const handleCreate = () => {
    console.log("CREATE", formData);
  };

  const handleUpdate = () => {
    console.log("UPDATE", formData);
  };

  const handleDelete = () => {
    console.log("DELETE", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitHandlers = {
      add: () => createCategory(config, formData),
      edit: () => updateCategory(config, data.id, formData),
      delete: () => deleteCategory(config, data.id),
    };

    const success = await submitHandlers[mode]?.();

    if (success) {
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
