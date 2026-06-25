import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Ticket_Login.css";

import TicketIcon from "../../../../assets/images/admin/ticketing/Ticketing-Icon.png";

//MAIN FORM
import TicketMainUser from "./pages/user/Ticket_MainUser";
import TicketMainStaff from "./pages/staff/Ticket_MainStaff";
import TicketMainAdmin from "./pages/admin/Ticket_MainAdmin";

export default function TicketLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //LOG IN UI
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usernameRef = useRef(null);

  //CHANGE PASSWORD UI
  const [changeUsername, setChangeUsername] = useState("");
  const [changeCurrentPassword, setChangeCurrentPassword] = useState("");
  const [changeNewPassword, setChangeNewPassword] = useState("");
  const [changeConfirmPassword, setChangeConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changeUsernameRef = useRef(null);

  //RESPONSE API HOOK
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  //MESSAGE
  const [successMessage, setSuccessMessage] = useState(false);

  // Check Login status when component loads
  // useEffect(() => {
  //   console.log(JSON.parse(localStorage.getItem("ticketingAuth")));
  //   const auth = JSON.parse(localStorage.getItem("ticketingAuth"));
  //   if (auth?.isLoggedIn) {
  //     setIsLoggedIn(true);
  //     setRole(auth.role);
  //     setDisplayName(auth.d_name);
  //     setUserId(auth.user_id);
  //   }
  // }, []);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }

    if (changeUsernameRef.current) {
      changeUsernameRef.current.focus();
    }
  }, [showChangePassword, isLoggedIn]);

  //USER CHANGE PASSWORD
  async function handleChangePassword(e) {
    e.preventDefault();

    if (changeNewPassword !== changeConfirmPassword) {
      alert("New password and Confirm password do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/ticketing/login/updatepassword
        `,
        {
          changeUsername,
          changeCurrentPassword,
          changeNewPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setChangeUsername("");
        setChangeCurrentPassword("");
        setChangeNewPassword("");
        setChangeConfirmPassword("");

        if (changeUsernameRef.current) {
          changeUsernameRef.current.focus();
        }

        setSuccessMessage(true);

        setTimeout(() => {
          setSuccessMessage(false);
        }, 2000);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  //USER LOG IN
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `
      ${process.env.REACT_APP_API_URL}/ticketing/login/validation
      `,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        const { d_name, role, user_id } = response.data;
        /* localStorage.setItem(
          "ticketingAuth",
          JSON.stringify({
            isLoggedIn: true,
            role,
            d_name,
            userId,
            username: username,
            lastActivity: Date.now(),
          }),
        ); */
        setRole(role);
        setDisplayName(d_name);
        setUserId(user_id);
        setIsLoggedIn(true);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }
  const handleLogout = () => {
    //localStorage.removeItem("ticketingAuth");

    setUsername("");
    setPassword("");
    setRole("");
    setUserId("");
    setDisplayName("");

    if (usernameRef.current) {
      usernameRef.current.focus();
    }

    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    const normalizedRole = role?.toLowerCase().trim();
    switch (normalizedRole) {
      case "user":
        return (
          <TicketMainUser
            onLogout={handleLogout}
            displayName={displayName}
            loggedinUserId={userId}
          />
        );
      case "staff":
        return (
          <TicketMainStaff onLogout={handleLogout} displayName={displayName} />
        );
      case "admin":
        return (
          <TicketMainAdmin onLogout={handleLogout} displayName={displayName} />
        );
      default:
        return <div>Invalid Role: {role}</div>;
    }
  }

  return (
    <div className="ticket-login-page">
      <div
        className={`ticket-login-card ${showChangePassword ? "flip-to-change" : "flip-to-login"}`}
      >
        {!showChangePassword ? (
          <>
            <div className="ticket-login-header">
              <div className="ticket-login-logo">
                <img src={TicketIcon} alt="Ticket Icon" />
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ticket-login-group">
                <label>Username</label>
                <input
                  required
                  type="text"
                  ref={usernameRef}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="ticket-login-group">
                <label>Password</label>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <span
                  className="ticket-login-group-password-icon"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button type="submit" className="ticket-login-signinbtn">
                Sign In
              </button>
              <button
                type="button"
                className="ticket-login-changepasswordbtn"
                onClick={() => {
                  setChangeUsername("");
                  setChangeCurrentPassword("");
                  setChangeNewPassword("");
                  setChangeConfirmPassword("");
                  setShowChangePassword(true);
                }}
              >
                Change Password
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="ticket-login-header">
              <div className="ticket-login-logo">
                <img src={TicketIcon} alt="Ticket Icon" />
              </div>
              <h2>Change Password</h2>
              <p>Update your account password</p>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="ticket-login-group">
                <label>Username</label>
                <input
                  required
                  type="text"
                  ref={changeUsernameRef}
                  value={changeUsername}
                  onChange={(e) => {
                    setChangeUsername(e.target.value);
                  }}
                />
              </div>
              <div className="ticket-login-group">
                <label>Current Password</label>
                <input
                  required
                  type={showCurrentPassword ? "text" : "password"}
                  value={changeCurrentPassword}
                  onChange={(e) => {
                    setChangeCurrentPassword(e.target.value);
                  }}
                />

                <span
                  className="ticket-login-group-currentpassword-icon"
                  onClick={() => {
                    setShowCurrentPassword(!showCurrentPassword);
                  }}
                >
                  {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <div className="ticket-login-group">
                <label>New Password</label>
                <input
                  required
                  type={showNewPassword ? "text" : "password"}
                  value={changeNewPassword}
                  onChange={(e) => {
                    setChangeNewPassword(e.target.value);
                  }}
                />

                <span
                  className="ticket-login-group-newpassword-icon"
                  onClick={() => {
                    setShowNewPassword(!showNewPassword);
                  }}
                >
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <div className="ticket-login-group">
                <label>Confirm Password</label>
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={changeConfirmPassword}
                  onChange={(e) => {
                    setChangeConfirmPassword(e.target.value);
                  }}
                />

                <span
                  className="ticket-login-group-confirmpassword-icon"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {successMessage && (
                <div className="ticket-login-successmessage">
                  <p>Password successfully updated</p>
                </div>
              )}

              <button type="submit" className="ticket-login-signinbtn">
                Save Password
              </button>
              <button
                type="button"
                className="ticket-login-changepasswordbtn"
                onClick={() => {
                  setUsername("");
                  setPassword("");
                  setShowChangePassword(false);
                }}
              >
                Back to Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
