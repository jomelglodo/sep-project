import React, { useEffect, useRef, useState } from "react";
import "./Ticket_MainTopbar.css";
import TicketIcon from "../../../../assets/images/admin/ticketing/Ticketing-Icon.png";

import UpdateProfile from "./Ticket_UpdateProfile";

export default function TicketMainUserTopbar({
  displayName,
  onLogout,
  loggedinUserId,
}) {
  // States
  const [open, setOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [modalPosition, setModalPosition] = useState({
    x: 0,
    y: 0,
  });

  //REFS
  const profileRef = useRef(null);

  // HELPER FUNCTION

  const renderPage = () => {
    switch (activePage) {
      case "updateprofile":
        return <UpdateProfile loggedinUserId={loggedinUserId} />;
      case "changepassword":
      default:
        return null;
    }
  };

  function closeModal() {
    setActivePage("");
    setShowUserModal(false);
  }

  return (
    <div className="ticket-main-topbar">
      {/* USER MODAL Profile, Change Password */}
      {showUserModal && (
        <div className="ticket-main-topbar-overlay">
          <div
            className="ticket-main-topbar-modal"
            key={activePage}
            style={{
              "--start-x": `${modalPosition.x}px`,
              "--start-y": `${modalPosition.y}px`,
            }}
          >
            <button
              className="ticket-main-topbar-modal-closebtn"
              onClick={closeModal}
            >
              X
            </button>
            {renderPage()}
          </div>
        </div>
      )}
      <div className="ticket-main-topbar-logo-container">
        <img src={TicketIcon} alt="Ticketing Logo" />
        <p>Ticketing System</p>
      </div>

      <div className="ticket-main-profile-topright">
        <div className="ticket-main-openspace">🔔</div>
        <div
          ref={profileRef}
          className="ticket-main-profile-wrapper"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="ticket-main-profile-container">
            <img
              src={`${process.env.REACT_APP_API_URL}/ticketing/main/profileimage/${loggedinUserId}`}
              alt="Profile Image"
            />
            <span>{displayName || "User"}</span>
          </div>
          {open && (
            <div className="ticket-main-profile-dropdown">
              <p
                onClick={() => {
                  const rect = profileRef.current.getBoundingClientRect();

                  setModalPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
                  setShowUserModal(true);
                  setActivePage("updateprofile");
                }}
              >
                Profile
              </p>
              <p>Change Password</p>
              <p onClick={onLogout}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
