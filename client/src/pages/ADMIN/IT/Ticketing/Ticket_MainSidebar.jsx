import React from "react";
import "./Ticket_MainSidebar.css";

export default function TicketMainUserHeader({ activePage, setActivePage }) {
  return (
    <aside className="ticket-mainuser-home-sidebar">
      <nav>
        <ul className="ticket-mainuser-home-menulist">
          <li
            className={`ticket-mainuser-home-menu-item ${activePage === "dashboard" ? "selectactive" : ""}`}
            onClick={() => {
              setActivePage("dashboard");
            }}
          >
            📊 Dashboard
          </li>
          <li
            className={`ticket-mainuser-home-menu-item ${activePage === "ticket" ? "selectactive" : ""}`}
            onClick={() => {
              setActivePage("ticket");
            }}
          >
            📁 Ticket
          </li>
          <li
            className={`ticket-mainuser-home-menu-item ${activePage === "announcement" ? "selectactive" : ""}
            }`}
            onClick={() => {
              setActivePage("announcement");
            }}
          >
            📢 Announcement
          </li>
        </ul>
      </nav>
    </aside>
  );
}
