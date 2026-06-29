import React, { useState, useRef, useEffect } from "react";
import HeaderTopbar from "../../Ticket_MainTopbar";
import HeaderSidebar from "../../Ticket_MainSidebar";

import "../../styles/staff/Ticket_MainStaff.css";

//pages
import MainStaffDashBoard from "./Ticket_Staff_Dashboard";

export default function TicketMainStaff({
  onLogout,
  displayName,
  setDisplayName,
  loggedinUserId,
  userRole,
}) {
  const [activePage, setActivePage] = useState("dashboard");

  /*   useEffect(() => {
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
  }, [onLogout]); */

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <MainStaffDashBoard />;

        break;

      default:
        break;
    }
  };
  return (
    <div className="ticket-mainstaff-home-layout">
      {/* TOPBAR */}
      <HeaderTopbar
        displayName={displayName}
        setDisplayName={setDisplayName}
        onLogout={onLogout}
        loggedinUserId={loggedinUserId}
      />
      <div className="ticket-mainstaff-home-body">
        {/* SIDEBAR */}
        <HeaderSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          userRole={userRole}
        />
        <main className="ticket-mainstaff-home-page-content">
          <div className="staff-renderpage-container" key={activePage}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
