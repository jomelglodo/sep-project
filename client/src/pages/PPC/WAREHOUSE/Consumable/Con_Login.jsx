import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../../../assets/styles/PPC/WAREHOUSE/Consumable/Con_Login.css";

import ConManagemet from "./Con_Management";

//IMPORT IMAGES

import { CON_IMAGE } from "../../../../assets/images/ppc/consumable_index";

export default function ConLogin() {
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [ifError, setIfError] = useState(false);
  const [showStatusMessage, setShowStatusMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [isLoggedin]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/con/checkpass`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enterPassword: password,
          }),
        },
      );
      const data = await result.json();

      if (data.success) {
        setShowStatusMessage(true);
        setStatusMessage(data.message);
        setIfError(false);
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 1000);
      } else {
        setShowStatusMessage(true);
        setStatusMessage(data.message);
        setIfError(true);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  if (isLoggedin) {
    return (
      <ConManagemet
        closeManagement={() => {
          setIsLoggedIn(false);
          setPassword("");
          setShowStatusMessage(false);
        }}
      />
    );
  }

  return (
    <div className="con-login-container">
      <form className="con-login-form" onSubmit={handleSubmit}>
        <div className="con-login-header">
          <h2>Warehouse Login</h2>
          <p>Please enter the administrator password</p>
        </div>
        <div className="con-login-group">
          <label htmlFor="">Password</label>
          <div className="con-login-password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter the password"
              required
              ref={passwordRef}
            />
            <span
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        {showStatusMessage &&
          (ifError ? (
            <div className="con-login-statusmessage-error">
              <p>{statusMessage}</p>
            </div>
          ) : (
            <div className="con-login-statusmessage-success">
              <p>{statusMessage}</p>
            </div>
          ))}
        <div className="con-login-button-container">
          <button type="submit">
            <img src={CON_IMAGE.home_loginbtn} alt="Login Button" />
            LOG IN
          </button>
        </div>
      </form>
    </div>
  );
}
