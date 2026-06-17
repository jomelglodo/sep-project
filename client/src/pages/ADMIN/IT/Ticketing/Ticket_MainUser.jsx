import React, { useState, useRef, useEffect } from "react";

export default function TicketMainUser({ onLogout, displayName }) {
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      const auth = JSON.parse(localStorage.getItem("ticketingAuth"));

      if (auth) {
        auth.lastActivity = Date.now();

        localStorage.setItem("ticketingAuth", JSON.stringify(auth));
      }

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        onLogout();
      }, 60000); // i minute
    };
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onLogout]);

  return (
    <div className="ticket-mainuser-container">
      <h2>This is the user main interface {displayName}</h2>
      <button onClick={onLogout}>LOG OUT</button>
    </div>
  );
}
