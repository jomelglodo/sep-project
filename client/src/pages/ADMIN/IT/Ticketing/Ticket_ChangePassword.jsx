import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Ticket_ChangePassword.css";
import { toast } from "react-toastify";

export default function AccountChangePassword({
  loggedinUserId,
  displayName,
  closeModal,
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //FaEye
  const [showCurPass, setShowCurPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  //REFS
  const curPassRef = useRef(null);

  //EFFETCS
  useEffect(() => {
    if (curPassRef.current) {
      curPassRef.current.focus();
    }
  }, []);

  //APIs
  const handlePassValidation = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/main/validation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedinUserId,
            curPass: currentPassword,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      return true;
    } catch (err) {
      toast.error("Something went wrong");
      return false;
    }
  };

  //FUNCTION HANDLERS
  async function handleChangePassword(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("New Password and Confirm Password did not match!");
    }

    try {
      const isValid = await handlePassValidation();
      if (!isValid) {
        return;
      }

      //Update the password
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/main/updatepassword/${loggedinUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPass: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        return toast.error(data.message);
      }

      closeModal();
      return toast.success(data.message);
    } catch (err) {
      toast.error(err);
    }
  }
  return (
    <div className="ticket-main-changepass-container">
      <div className="ticket-main-changepass-header">
        <h2>Change Password</h2>
      </div>
      <div className="ticket-main-changepass-body">
        <form
          action=""
          className="ticket-main-changepass-form"
          onSubmit={handleChangePassword}
        >
          <div className="ticket-main-changepass-form-group">
            <label>User ID</label>
            <label>{loggedinUserId ? loggedinUserId : "-"}</label>
          </div>
          <div className="ticket-main-changepass-form-group">
            <label>Username</label>
            <label>{displayName ? displayName : "-"}</label>
          </div>
          <div className="ticket-main-changepass-form-group">
            <label>Current Password</label>
            <input
              ref={curPassRef}
              type={showCurPass ? "text" : "password"}
              maxLength={20}
              required
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
            />
            <span
              onClick={() => {
                setShowCurPass(!showCurPass);
              }}
            >
              {showCurPass ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div className="ticket-main-changepass-form-group">
            <label>New Password</label>
            <input
              type={showNewPass ? "text" : "password"}
              maxLength={20}
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <span
              onClick={() => {
                setShowNewPass(!showNewPass);
              }}
            >
              {showNewPass ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div className="ticket-main-changepass-form-group">
            <label>Confirm Password</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              maxLength={20}
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <span
              onClick={() => {
                setShowConfirmPass(!showConfirmPass);
              }}
            >
              {showConfirmPass ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="ticket-main-changepass-button-form-container">
            <button type="submit" className="ticket-main-changepass-changebtn">
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
