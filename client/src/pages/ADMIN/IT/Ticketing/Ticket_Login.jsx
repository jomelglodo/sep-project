import React, { useEffect, useRef, useState } from "react";
import "../../../../assets/styles/IT/Ticketing/Ticket_Login.css";

export default function TicketLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameRef = useRef(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div className="ticket-login-page">
      <div className="ticket-login-card">
        <div className="ticket-login-header">
          <div className="ticket-login-logo">TICKET</div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ticket-login-group">
            <label>Username</label>
            <input
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
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="ticket-login-signinbtn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
