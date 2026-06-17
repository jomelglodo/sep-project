import React, { useState, useRef, useEffect } from "react";
import "../../styles/user/Ticket_MainUser.css";
import HeaderTopbar from "../../Ticket_MainUserTopbar";
import HeaderSidebar from "../../Ticket_MainUserSidebar";

//SIDEBAR PAGES
import Dashboard from "./Ticket_MainUser_Dashboard";

export default function TicketMainUser({ onLogout, displayName }) {
  const [activePage, setActivePage] = useState("dashboard");
  /* useEffect(() => {
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
 */
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "announcement":
      default:
        return null;
    }
  };
  return (
    <div className="ticket-mainuser-home-layout">
      {/* TOPBAR */}
      <HeaderTopbar displayName={displayName} onLogout={onLogout} />

      <div className="ticket-mainuser-home-body">
        {/* SIDEBAR */}
        <HeaderSidebar activePage={activePage} setActivePage={setActivePage} />
        {/* CONTENT */}
        <main className="ticket-mainuser-home-page-content">
          {/* TITLE */}

          {renderContent()}
        </main>
      </div>
      {/* <button onClick={onLogout}>LOG OUT</button> */}
    </div>
  );
}
