import React, { useState, useRef, useEffect } from "react";
import "../../styles/admin/Ticket_Admin_Dashboard.css";

//ICONS
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { TbTicketOff } from "react-icons/tb";

export default function MainAdminDashboard() {
  const [counterTickets, setCounterTickets] = useState({
    total: 1,
    open: 0,
    inprogress: 10,
    closed: 2,
    cancelled: 15,
  });
  return (
    <div className="ticket-mainadmin-dashboard-container">
      <h2 className="ticket-mainadmin-dashboard-title">Dashboard</h2>
      {/* TICKET COUNTER */}

      <div className="ticket-mainadmin-dashboard-ticketcounter-container">
        <div className="ticket-mainadmin-dashboard-ticketcounter-group total">
          <div className="ticket-mainadmin-dashboard-count">
            <h3>{counterTickets.total}</h3>
            <p>Total Tickets</p>
          </div>

          <BsFillTicketPerforatedFill />
        </div>
        <div className="ticket-mainadmin-dashboard-ticketcounter-group open">
          <div className="ticket-mainadmin-dashboard-count">
            <h3>{counterTickets.open}</h3>
            <p>Open Tickets</p>
          </div>

          <FaFolderOpen />
        </div>
        <div className="ticket-mainadmin-dashboard-ticketcounter-group inprogress">
          <div className="ticket-mainadmin-dashboard-count">
            <h3>{counterTickets.inprogress}</h3>
            <p>In Progress</p>
          </div>

          <FaClock />
        </div>
        <div className="ticket-mainadmin-dashboard-ticketcounter-group closed">
          <div className="ticket-mainadmin-dashboard-count">
            <h3>{counterTickets.closed}</h3>
            <p>Closed Tickets</p>
          </div>

          <FaCheckSquare />
        </div>
        <div className="ticket-mainadmin-dashboard-ticketcounter-group cancelled">
          <div className="ticket-mainadmin-dashboard-count">
            <h3>{counterTickets.cancelled}</h3>
            <p>Cancelled</p>
          </div>

          <TbTicketOff />
        </div>
      </div>
      <div className="ticket-mainadmin-dashboard-body">
        <div className="ticket-mainadmin-dashboard-statistics">
          {/* RECENT TICKET TABLE */}
          <div className="ticket-mainadmin-dashboard-table-wrapper ticket-mainstaff-card">
            <h3 className="ticket-mainadmin-dashboard-table-title">
              Assign Tickets
            </h3>
            <div className="ticket-mainadmin-dashboard-table-container">
              <table className="ticket-mainadmin-dashboard-table">
                <thead>
                  <tr>
                    <th>Ticket No.</th>
                    <th>Date Created</th>
                    <th>User</th>
                    <th>Subject</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {ticketList.map((item, index) => (
                       <tr key={index}>
                         <td>{item.ticket_num}</td>
                         <td>{item.date_submitted}</td>
                         <td>{item.r_name}</td>
                         <td>{item.subject_title}</td>
                         <td style={{ textAlign: "center" }}>
                           <span
                             className={
                               item.status === "In Progress"
                                 ? "mainstaff-status-inprogress"
                                 : ""
                             }
                           >
                             {" "}
                             {item.status}
                           </span>
                         </td>
                       </tr>
                     ))} */}
                </tbody>
              </table>
            </div>
          </div>
          {/* CHART */}
          <div className="ticket-mainadmin-dashboard-chart-wrapper ticket-mainstaff-card">
            <h3 className="ticket-mainadmin-dashboard-chart-title">
              Ticket Status
            </h3>
            {/*  <DashboardChart ticketCounts={counterTickets} /> */}
          </div>

          <div className="ticket-mainadmin-dashboard-performancemetric ticket-mainstaff-card">
            <h3 className="ticket-mainadmin-dashboard-performancemetric-title">
              Performance Metric
            </h3>
            <div className="ticket-mainadmin-dashboard-performancemetric-breakdown">
              <div className="ticket-mainadmin-dashboard-performancemetric-total mainstaff-performancemetric-group">
                <p>Total Assigned : </p>
                <h3>0</h3>
              </div>

              <div className="ticket-mainadmin-dashboard-performancemetric-resolved mainstaff-performancemetric-group">
                <p>Resolved Today : </p>
                <h3>0</h3>
              </div>

              <div className="ticket-mainadmin-dashboard-performancemetric-average mainstaff-performancemetric-group">
                <p>Average Resolution : </p>
                <h3>0</h3>
              </div>

              <div className="ticket-mainadmin-dashboard-performancemetric-SLA mainstaff-performancemetric-group">
                <p>SLA Compliance : </p>
                <h3>0</h3>
              </div>
            </div>
          </div>

          <div className="ticket-mainadmin-dashboard-performanceactivity-container ticket-mainstaff-card">
            <h3 className="ticket-mainadmin-dashboard-performanceactivity-title">
              Recent Activity
            </h3>
            <div className="ticket-mainadmin-dashboard-performanceactivity-body">
              <p>dasdasd</p>
              <p>dasdasd</p>
              <p>dasdasd</p>
              <p>dasdasd</p>
              <p>dasdasd</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
