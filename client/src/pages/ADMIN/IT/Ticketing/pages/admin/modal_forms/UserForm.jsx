import React, { useEffect } from "react";
import styles from "./UserForm.module.css";

export default function MainAdminUserForm({
  mode,
  formData,
  setFormData,
  errors,
  role,
  status,
  department,
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
          name="d_name"
          value={formData.d_name}
          onChange={handleChange}
        />
        {errors.d_name && <p className={styles.error}>{errors.d_name}</p>}
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
            <option value="" disabled>
              Select Department
            </option>
            {department.map((item, index) => (
              <option key={index} value={item.department}>
                {item.department}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.form_group}>
          <label>Role *</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="" disabled>
              Select Role
            </option>
            {role.map((item, index) => (
              <option key={index} value={item.role}>
                {item.role}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.form_group}>
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="" disabled>
            Select Status
          </option>
          {status.map((item, index) => (
            <option key={index} value={item.status}>
              {item.status}
            </option>
          ))}
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
