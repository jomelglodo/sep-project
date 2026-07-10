import React, { useState } from "react";
import styles from "./AddUserModal.module.css";

import Modal from "../modal/Modal";
import UserForm from "./UserForm";

export default function MainAdminAddUser({
  open,
  onClose,
  onSave,
  role,
  status,
  department,
}) {
  const [saving, setSaving] = useState(false);
  const initialForm = {
    d_name: "",
    username: "",
    email: "",
    department: "",
    role: "",
    status: "Active",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!formData.d_name.trim()) newErrors.d_name = "Display name is required.";

    if (!formData.username.trim()) newErrors.username = "Username is required.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.email) {
      if (!emailPattern.test(formData.email))
        newErrors.email = "Invalid email address.";
    }

    if (!formData.department.trim())
      newErrors.department = "Select a department";

    if (!formData.role.trim()) newErrors.role = "Select a role.";

    if (!formData.password.length > 5)
      newErrors.password = "Password must be at least 5 characters.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Password do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      setSaving(true);
      onSave(formData);

      setFormData(initialForm);

      setErrors({});

      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add New User"
      onClose={onClose}
      footer={
        <>
          <button className={styles.secondary_btn} onClick={handleClose}>
            Cancel
          </button>
          <button
            className={styles.primary_btn}
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? "Saving...." : "Save User"}
          </button>
        </>
      }
    >
      <UserForm
        mode="add"
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        role={role}
        status={status}
        department={department}
      />
    </Modal>
  );
}
