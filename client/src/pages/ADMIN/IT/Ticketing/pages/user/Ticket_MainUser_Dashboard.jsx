import React, { useState, useEffect, useRef } from "react";
import "../../styles/user/Ticket_MainUser_Dashboard.css";
export default function MainUserDashBoard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    progress: 0,
    closed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    // simulate API
    setTimeout(() => {
      setStats({
        total: 120,
        open: 30,
        progress: 25,
        closed: 55,
        cancelled: 10,
      });
    }, 500);
  }, []);
  return (
    <div className="ticket-mainuser-dashboard-container">
      <h2 className="ticket-mainuser-home-title">Title</h2>
      <div className="ticket-mainuser-dashboard-ticketcounter-container">
        <div className="ticket-mainuser-home-ticketcounter-group total">
          Total Tickets
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group open">
          Open Tickets
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group inprogress">
          In Progress Tickets
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group closed">
          Closed
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group cancelled">
          Cancelled
        </div>
      </div>
    </div>
  );
}
