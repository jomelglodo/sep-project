import React, { Profiler, useEffect, useRef, useState } from "react";
import "./Ticket_MainTopbar.css";
import TicketIcon from "../../../../assets/images/admin/ticketing/Ticketing-Icon.png";
import { toast } from "react-toastify";
import socket from "../../../../services/socket.js";

import UpdateProfile from "./Ticket_UpdateProfile";
import ChangePassword from "./Ticket_ChangePassword";

//notification bell
import NotificationBell from "./components/notification/NotificationBell";
import NotificationDropDown from "./components/notification/NotificationDropDown";

export default function TicketMainUserTopbar({
  displayName,
  setDisplayName,
  onLogout,
  loggedinUserId,
}) {
  // States

  //notification
  const [openNotifications, setOpenNotifications] = useState(false);
  //Profile image version
  const [profileImageVersion, setProfileImageVersion] = useState(Date.now());

  const [open, setOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [modalPosition, setModalPosition] = useState({
    x: 0,
    y: 0,
  });

  //REFS
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  //EFFECTS

  //close the notification when the user click outside the ticket-main-notification

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //  {#85d,15}
  /*   useEffect(() => {
    const fetchStarttroubleshoot = (data) => {
      //show a notification
      toast.info(
        `${data.ticketNum} is now In Progress, Assigned IT: ${data.staffName}`,
      );
    };

    socket.on("ticket-starttroubleshoot", fetchStarttroubleshoot);

    return () => {
      socket.off("ticket-starttroubleshoot", fetchStarttroubleshoot);
    };
  }, []); */

  // HELPER FUNCTION

  const renderPage = () => {
    switch (activePage) {
      case "updateprofile":
        return (
          <UpdateProfile
            loggedinUserId={loggedinUserId}
            onDisplayNameChange={setDisplayName}
            onProfileImageChange={() => setProfileImageVersion(Date.now())}
            closeModal={closeModal}
          />
        );
      case "changepassword":
        return (
          <ChangePassword
            displayName={displayName}
            closeModal={closeModal}
            loggedinUserId={loggedinUserId}
          />
        );
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
        {/* NOTIFICATIONS */}
        <div className="ticket-main-notification" ref={notificationRef}>
          <NotificationBell
            isOpen={openNotifications}
            onToggle={() => setOpenNotifications((prev) => !prev)}
          />
          {openNotifications && <NotificationDropDown />}
        </div>
        <div
          ref={profileRef}
          className="ticket-main-profile-wrapper"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="ticket-main-profile-container">
            <img
              src={`${process.env.REACT_APP_API_URL}/ticketing/main/profileimage/${loggedinUserId}?v=${profileImageVersion}`}
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
              <p
                onClick={() => {
                  const rect = profileRef.current.getBoundingClientRect();

                  setModalPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });

                  setShowUserModal(true);
                  setActivePage("changepassword");
                }}
              >
                Change Password
              </p>
              <p onClick={onLogout}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
