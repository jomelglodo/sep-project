import { useEffect, useRef, useState } from "react";
import styles from "./CategoryForm.module.css";

export default function CategoryForm({
  modalState,
  config,
  formData,
  setFormData,
}) {
  const { open, mode, data } = modalState;
  const inputRef = useRef(null);

  /*  const [formData, setFormData] = useState({}); */
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      const initialData = {};

      config.fields.forEach((field) => {
        initialData[field.name] = "";
      });

      setFormData(initialData);
    }
  }, [config, data]);

  useEffect(() => {
    if (modalState.open && mode !== "view") {
      inputRef.current?.focus();
    }
  }, [modalState.open, mode, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.body}>
      {config.fields.map((field) => (
        <div key={field.name} className={styles.formGroup}>
          <label>{field.label} : </label>

          <input
            ref={inputRef}
            type={field.type}
            name={field.name}
            value={formData[field.name] ?? ""}
            placeholder={field.placeholder}
            required={field.required}
            disabled={modalState.mode === "view" || field.disabled}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
}
