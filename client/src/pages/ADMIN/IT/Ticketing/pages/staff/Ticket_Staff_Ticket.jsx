import React, { useEffect, useState } from "react";
import "../../styles/staff/Ticket_Staff_Ticket.css";
import socket from "../../../../../../services/socket";
import { toast } from "react-toastify";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
//pages
import AllTickets from "./Ticket_Staff_TicketAll";
import AssignedTickets from "./Ticket_Staff_TicketAssigned";

export default function StaffTicketManagement({ displayName, loggedinUserId }) {
  const [activeTab, setActiveTab] = useState("all");

  //  {#f8d,13}
  //EFFECTS
  //notification once new ticket is created
  useEffect(() => {
    socket.on("ticket-created", (data) => {
      toast.info(
        `A new ticket has been created by ${data.displayname} with Ticket No. : ${data.ticketNum}`,
      );
    });

    return () => {
      socket.off("ticket-created");
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <AllTickets
            displayName={displayName}
            loggedinUserId={loggedinUserId}
          />
        );
        break;
      case "assigned":
        return (
          <AssignedTickets
            displayName={displayName}
            loggedinUserId={loggedinUserId}
          />
        );
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
