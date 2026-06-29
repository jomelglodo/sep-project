import React, { useState, useEffect, useRef } from "react";
import "../../styles/staff/Ticket_Staff_Dashboard.css";

//ICONS
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { TbTicketOff } from "react-icons/tb";

export default function MainStaffDashBoard({ displayName, loggedinUserId }) {
  const [ticketList, setTicketList] = useState([]);

  const [counterTicket, setCounterTicket] = useState({
    total: 0,
    open: 0,
    inprogress: 2,
    cancelled: 0,
    closed: 0,
  });

  /*   useEffect(() => {
    // simulate API

    setTimeout(() => {
      fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/user/ticket/countticket/${loggedinUserId}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setCounterTicket(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 500);
  }, []); */

  /*   useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/user/ticket/gettickets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            d_name: displayName,
          }),
        },
      );

      const data = await result.json();
      setTicketList(data);
    } catch (err) {
      console.error(err);
    }
  };
 */
  return (
    <div className="ticket-mainstaff-dashboard-container">
      <h2 className="ticket-mainstaff-dashboard-title">Dashbord</h2>
      {/* TICKET COUNTER */}

      <div className="ticket-mainstaff-dashboard-ticketcounter-container">
        <div className="ticket-mainstaff-dashboard-ticketcounter-group total">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTicket.total}</h3>
            <p>Total Tickets</p>
          </div>

          <BsFillTicketPerforatedFill />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group open">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTicket.open}</h3>
            <p>Open Tickets</p>
          </div>

          <FaFolderOpen />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group inprogress">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTicket.inprogress}</h3>
            <p>In Progress</p>
          </div>

          <FaClock />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group closed">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTicket.closed}</h3>
            <p>Closed Tickets</p>
          </div>

          <FaCheckSquare />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group cancelled">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTicket.cancelled}</h3>
            <p>Cancelled</p>
          </div>

          <TbTicketOff />
        </div>
      </div>
      <div className="ticket-mainstaff-dashboard-body">
        <div className="ticket-mainstaff-dashboard-statistics">
          {/* RECENT TICKET TABLE */}
          <div className="ticket-mainstaff-dashboard-table-wrapper ticket-mainstaff-card">
            <h3>Assign Tickets</h3>
            <div className="ticket-mainstaff-dashboard-table-container">
              <table className="ticket-mainstaff-dashboard-table">
                <thead>
                  <tr>
                    <th>Ticket No.</th>
                    <th>Date Created</th>
                    <th>User</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketList.map((item, index) => (
                    <tr key={index}></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* CHART */}
          <div className="ticket-mainstaff-dashboard-chart-wrapper ticket-mainstaff-card">
            <h3>Ticket Status</h3>
          </div>

          <div className="ticket-mainstaff-dashboard-performance-metric ticket-mainstaff-card">
            <h3>Performance Metric</h3>
          </div>

          <div className="ticket-mainstaff-dashboard-performance-activity ticket-mainstaff-card">
            <h3>Recent Activity</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
