import React, { useState } from "react";
import "./Ticket_MainUserTopbar.css";
import TicketIcon from "../../../../assets/images/admin/ticketing/Ticketing-Icon.png";

export default function TicketMainUserTopbar({ displayName, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ticket-mainuser-topbar">
      <div className="ticket-mainuser-topbar-logo-container">
        <img src={TicketIcon} alt="Ticketing Logo" />
        <p>Ticketing System</p>
      </div>

      <div className="ticket-mainuser-profile-topright">
        <div className="ticket-mainuser-openspace">🔔</div>
        <div
          className="ticket-mainuser-profile-wrapper"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="ticket-mainuser-profile-container">
            <img src="" alt="Profile Image" />
            <span>{displayName || "User"}</span>
          </div>
          {open && (
            <div className="ticket-mainuser-profile-dropdown">
              <p>Profile</p>
              <p>Setting</p>
              <p onClick={onLogout}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
