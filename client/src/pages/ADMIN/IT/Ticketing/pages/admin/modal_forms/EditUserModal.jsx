import React, { useState, useEffectEvent, useEffect } from "react";
import styles from "./EditUserModal.module.css";
import Modal from "../modal/Modal";
import UserForm from "./UserForm";

export default function MainAdminEditUser({ open, user, onClose, onSave }) {
  const initialForm = {
    displayname: "",
    username: "",
    email: "",
    department: "",
    role: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  //EFFECTS

  useEffect(() => {
    if (user) {
      setFormData({
        displayname: user.displayname,
        username: user.username,
        email: user.email,
        department: user.department,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);
  //HANDLER
  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      ...user,

      ...formData,
    });

    onClose();
  };
  //HELPER
  const validate = () => {
    const newErrors = {};

    if (!formData.displayname.trim()) newErrors.displayname = "Required";

    if (!formData.username.trim()) newErrors.username = "Required";

    if (!formData.email.trim()) newErrors.email = "Required";

    if (!formData.department) newErrors.department = "Required";

    if (!formData.role) newErrors.role = "Required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  return (
    <Modal
      open={open}
      title="Edit User"
      onClose={onClose}
      footer={
        <>
          <button className={styles.secondary_btn} onClick={onClose}>
            Cancel
          </button>

          <button className={styles.primary_btn} onClick={handleSubmit}>
            Save Changes
          </button>
        </>
      }
    >
      <UserForm
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </Modal>
  );
}
