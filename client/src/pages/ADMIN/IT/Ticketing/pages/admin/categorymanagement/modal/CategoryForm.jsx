import { useEffect, useState } from "react";
import styles from "./CategoryModal.module.css";

export default function CategoryForm({
  modalState,
  config,
  formData,
  setFormData,
}) {
  const { mode, data } = modalState;

  /*  const [formData, setFormData] = useState({}); */

  useEffect(() => {
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
          <label>{field.label}</label>

          <input
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
