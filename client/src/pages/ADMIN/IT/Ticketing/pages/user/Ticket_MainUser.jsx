import React, { useState, useRef, useEffect } from "react";
import "../../styles/user/Ticket_MainUser.css";
import HeaderTopbar from "../../Ticket_MainTopbar";
import HeaderSidebar from "../../Ticket_MainSidebar";

//SIDEBAR PAGES
import MainUserDashBoard from "./Ticket_User_Dashboard";
import MainUserTicket from "./Ticket_User_Ticket";

export default function TicketMainUser({
  onLogout,
  displayName,
  setDisplayName,
  loggedinUserId,
  userRole,
}) {
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
        return (
          <MainUserDashBoard
            displayName={displayName}
            loggedinUserId={loggedinUserId}
          />
        );

      case "ticket":
        return (
          <MainUserTicket
            displayName={displayName}
            loggedinUserId={loggedinUserId}
          />
        );

      case "announcement":
      default:
        return null;
    }
  };

  return (
    <div className="ticket-mainuser-home-layout">
      {/* TOPBAR */}
      <HeaderTopbar
        displayName={displayName}
        setDisplayName={setDisplayName}
        onLogout={onLogout}
        loggedinUserId={loggedinUserId}
      />

      <div className="ticket-mainuser-home-body">
        {/* SIDEBAR */}
        <HeaderSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          userRole={userRole}
        />
        {/* CONTENT */}
        <main className="ticket-mainuser-home-page-content">
          {/* TITLE */}
          <div className="user-renderpage-container" key={activePage}>
            {renderContent()}
          </div>
        </main>
      </div>
      {/* <button onClick={onLogout}>LOG OUT</button> */}
    </div>
  );
}
