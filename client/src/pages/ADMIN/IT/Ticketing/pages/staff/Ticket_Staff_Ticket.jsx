import React, { useEffect, useState } from "react";
import "../../styles/staff/Ticket_Staff_Ticket.css";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
//pages
import AllTickets from "./Ticket_Staff_TicketAll";
export default function StaffTicketManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <AllTickets />;
        break;
      case "assigned":
        break;
      case "noted":
        break;
      default:
        null;
    }
  };

  return (
    <div className="ticket-mainstaff-ticket-container">
      <div className="ticket-mainstaff-ticket-header">
        <button
          className={`ticket-mainstaff-ticket-headertab ${activeTab === "all" ? "active-staffheader" : ""}`}
          onClick={() => {
            setActiveTab("all");
          }}
        >
          <FaListAlt />
          <span>All Tickets</span>
        </button>
        <button
          className={`ticket-mainstaff-ticket-headertab ${activeTab === "assigned" ? "active-staffheader" : ""}`}
          onClick={() => {
            setActiveTab("assigned");
          }}
        >
          <FaUserCheck />
          <span>Assigned Tickets</span>
        </button>
        <button
          className={`ticket-mainstaff-ticket-headertab ${activeTab === "notes" ? "active-staffheader" : ""}`}
          onClick={() => {
            setActiveTab("notes");
          }}
        >
          <FaStickyNote />
          <span>Internal Notes</span>
        </button>
      </div>

      <div className="ticket-mainstaff-ticket-content">{renderContent()}</div>
    </div>
  );
}
