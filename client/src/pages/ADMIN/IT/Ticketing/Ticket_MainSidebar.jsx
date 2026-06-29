import React from "react";
import "./Ticket_MainSidebar.css";

//ICONS

import { MdOutlineMessage } from "react-icons/md";
import { LuTicket } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";

export default function TicketMainUserHeader({
  activePage,
  setActivePage,
  userRole,
}) {
  function renderMenu() {
    switch (userRole) {
      case "user":
        return (
          <ul className="ticket-main-home-menulist">
            <li
              className={`ticket-main-home-menu-item ${activePage === "dashboard" ? "selectactive" : ""}`}
              onClick={() => {
                setActivePage("dashboard");
              }}
            >
              <span className="ticket-main-icon">
                <MdOutlineDashboard />
              </span>
              <span className="menu-text">Dashboard</span>
            </li>
            <li
              className={`ticket-main-home-menu-item ${activePage === "ticket" ? "selectactive" : ""}`}
              onClick={() => {
                setActivePage("ticket");
              }}
            >
              <span className="ticket-main-icon">
                <LuTicket />
              </span>
              <span className="menu-text">Ticket</span>
            </li>
            <li
              className={`ticket-main-home-menu-item ${activePage === "announcement" ? "selectactive" : ""}
            }`}
              onClick={() => {
                setActivePage("announcement");
              }}
            >
              <span className="ticket-main-icon">
                <TfiAnnouncement />
              </span>
              <span className="menu-text">Announcement</span>
            </li>
          </ul>
        );
        break;
      case "staff":
        return (
          <ul className="ticket-main-home-menulist">
            <li
              className={`ticket-main-home-menu-item ${activePage === "dashboard" ? "selectactive" : ""}`}
              onClick={() => {
                setActivePage("dashboard");
              }}
            >
              <span className="ticket-main-icon">
                <MdOutlineDashboard />
              </span>
              <span className="menu-text">Dashboard</span>
            </li>
            <li
              className={`ticket-main-home-menu-item ${activePage === "ticketmangement" ? "selectactive" : ""}`}
              onClick={() => {
                setActivePage("ticketmanagement");
              }}
            >
              <span className="ticket-main-icon">
                <LuTicket />
              </span>
              <span className="menu-text">Ticket Management</span>
            </li>
            <li
              className={`ticket-main-home-menu-item ${activePage === "message" ? "selectactive" : ""}
            }`}
              onClick={() => {
                setActivePage("message");
              }}
            >
              <span className="ticket-main-icon">
                <MdOutlineMessage />
              </span>
              <span className="menu-text">Message</span>
            </li>
            <li
              className={`ticket-main-home-menu-item ${activePage === "announcement" ? "selectactive" : ""}
            }`}
              onClick={() => {
                setActivePage("announcement");
              }}
            >
              <span className="ticket-main-icon">
                <TfiAnnouncement />
              </span>
              <span className="menu-text">Announcement</span>
            </li>
          </ul>
        );
        break;
      case "admin":
        break;
      default:
        return;
    }
  }

  return (
    <aside className="ticket-main-home-sidebar">
      <nav>{renderMenu()}</nav>
    </aside>
  );
}
