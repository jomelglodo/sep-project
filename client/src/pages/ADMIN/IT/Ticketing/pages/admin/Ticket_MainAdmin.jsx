import React, { useState, useRef, useEffect } from "react";
import "../../styles/admin/Ticket_MainAdmin.css";

//COMPONENTS
import HeaderTopbar from "../../Ticket_MainTopbar";
import HeaderSidebar from "../../Ticket_MainSidebar";

//PAGES
import Dashboard from "./Ticket_Admin_Dashboard";
import UserManagement from "./usermanagement/User_Management";
import Category from "./categorymanagement/Category";

export default function TicketMainAdmin({
  onLogout,
  displayName,
  setDisplayName,
  loggedinUserId,
  userRole,
}) {
  const [activePage, setActivePage] = useState("dashboard");
  /*  useEffect(() => {
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
        return <Dashboard />;
        break;
      case "usermanagement":
        return <UserManagement displayName={displayName} />;
        break;
      case "category":
        return <Category displayName={displayName} />;
        break;
      case "announcement":
        break;
      case "report":
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activePage]);

  return (
    <div className="ticket-mainadmin-home-layout">
      {/* TOPBAR */}
      <HeaderTopbar
        displayName={displayName}
        setDisplayName={setDisplayName}
        onLogout={onLogout}
        loggedinUserId={loggedinUserId}
      />

      <div className="ticket-mainadmin-home-body">
        {/* SIDEBAR */}
        <HeaderSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          userRole={userRole}
        />
        <main className="ticket-mainadmin-home-page-content">
          <div className="admin-renderpage-container" key={activePage}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
