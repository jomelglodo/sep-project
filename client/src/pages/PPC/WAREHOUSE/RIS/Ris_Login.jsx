import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_Login.css";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ris_index";

export default function RisLogin({ closeLogin, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const usernameRef = useRef(null);

  /* ADDING AUTO FOCUS EFFECT ON USERNAME WHEN THIS FORM LOADS */
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    setErrorMessage("");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/risLogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        //alert("Login Successful");
        setErrorMessage("");
        setSuccessMessage("Login Successfully");

        //add 1 second delay before closing the modal, to show the success message
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setErrorMessage("Envalid Employee ID or Password");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Server Error");
    }
  }

  return (
    <div className="ris-login-container">
      {/* CLOSE BUTTON */}
      <button className="btn-ris-close-login" onClick={closeLogin}>
        X
      </button>
      <div className="ris-login-header">
        <h2>Warehouse Login</h2>
        <p>Please enter your account credentials</p>
      </div>
      <form className="ris-login-form" onSubmit={handleLogin}>
        {successMessage && (
          <p className="ris-login-success">{successMessage}</p>
        )}
        {errorMessage && <p className="ris-login-error">{errorMessage}</p>}
        <div className="ris-login-group">
          <label>Username</label>
          <input
            ref={usernameRef}
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="ris-login-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Input the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-ris-login-submit">
          <img src={RIS_IMAGE.all_login_btn} alt="Log-in Button" />
          LOGIN
        </button>
      </form>
    </div>
  );
}
