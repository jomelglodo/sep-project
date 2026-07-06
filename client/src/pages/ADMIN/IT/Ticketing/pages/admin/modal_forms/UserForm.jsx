import React, { useEffect } from "react";
import styles from "./UserForm.module.css";

export default function MainAdminUserForm({
  mode,
  formData,
  setFormData,
  errors,
}) {
  //HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };
  return (
    <form className={styles.user_form}>
      <div className={styles.form_group}>
        <label>Display Name *</label>
        <input
          type="text"
          name="displayname"
          value={formData.displayname}
          onChange={handleChange}
        />
        {errors.displayname && (
          <p className={styles.error}>{errors.displayname}</p>
        )}
      </div>
      <div className={styles.form_group}>
        <label>Username *</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className={styles.error}>{errors.username}</p>}
      </div>
      <div className={styles.form_group}>
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>
      <div className={styles.row}>
        <div className={styles.form_group}>
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
          </select>
        </div>
        <div className={styles.form_group}>
          <label>Role *</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="">Admin</option>
            <option value="">Staff</option>
            <option value="">User</option>
          </select>
        </div>
      </div>
      <div className={styles.form_group}>
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Active</option>

          <option>Inactive</option>
        </select>
      </div>
      {mode === "add" && (
        <>
          <div className={styles.form_group}>
            <label>Password *</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>
          {/* Confirm Password */}
          <div className={styles.form_group}>
            <label>Confirm Password *</label>
            <input
              type="text"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>
        </>
      )}
    </form>
  );
}
