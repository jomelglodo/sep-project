import React from "react";
import "./Ticket_MainSidebar.css";

//ICONS

import { MdOutlineMessage } from "react-icons/md"; //message
import { LuTicket } from "react-icons/lu"; //ticket management
import { MdOutlineDashboard } from "react-icons/md"; //dashboard
import { TfiAnnouncement } from "react-icons/tfi"; //announcement
import { MdManageAccounts } from "react-icons/md"; // user management
import { TbCategoryPlus } from "react-icons/tb"; //category
import { HiOutlineDocumentReport } from "react-icons/hi"; //report module

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
              className={`ticket-main-home-menu-item ${activePage === "ticketmanagement" ? "selectactive" : ""}`}
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
              className={`ticket-main-home-menu-item ${activePage === "usermanagement" ? "selectactive" : ""}`}
              onClick={() => {
                setActivePage("usermanagement");
              }}
            >
              <span className="ticket-main-icon">
                <MdManageAccounts />
              </span>
              <span className="menu-text">User Management</span>
            </li>
            <li
              className={`ticket-main-home-menu-item ${activePage === "category" ? "selectactive" : ""}
            }`}
              onClick={() => {
                setActivePage("category");
              }}
            >
              <span className="ticket-main-icon">
                <TbCategoryPlus />
              </span>
              <span className="menu-text">Category</span>
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
            <li
              className={`ticket-main-home-menu-item ${activePage === "report" ? "selectactive" : ""}
            }`}
              onClick={() => {
                setActivePage("reporting");
              }}
            >
              <span className="ticket-main-icon">
                <HiOutlineDocumentReport />
              </span>
              <span className="menu-text">Report Module</span>
            </li>
          </ul>
        );
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
