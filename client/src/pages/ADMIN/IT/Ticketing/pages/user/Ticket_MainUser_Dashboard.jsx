import React, { useState, useEffect, useRef } from "react";
import "../../styles/user/Ticket_MainUser_Dashboard.css";
import UserTicketDashboardChart from "./Ticket_User_DashboardChart";

export default function MainUserDashBoard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    closed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    // simulate API
    setTimeout(() => {
      setStats({
        total: 120,
        open: 30,
        inprogress: 25,
        closed: 55,
        cancelled: 10,
      });
    }, 500);
  }, []);
  return (
    <div className="ticket-mainuser-dashboard-container">
      <h2>Dashbord</h2>
      {/* TICKET COUNTER */}
      <div className="ticket-mainuser-dashboard-ticketcounter-container">
        <div className="ticket-mainuser-home-ticketcounter-group total">
          <h3>{stats.total}</h3>
          <p>Total Tickets</p>
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group open">
          <h3>{stats.open}</h3>
          <p>Open Tickets</p>
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group inprogress">
          <h3>{stats.inprogress}</h3>
          <p>In Progress</p>
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group closed">
          <h3>{stats.closed}</h3>
          <p>Closed Tickets</p>
        </div>
        <div className="ticket-mainuser-home-ticketcounter-group cancelled">
          <h3>{stats.cancelled}</h3>
          <p>Cancelled</p>
        </div>
      </div>
      <div className="ticket-mainuser-dashboard-statistics">
        {/* RECENT TICKET TABLE */}
        <div className="ticket-mainuser-dashboard-table-wrapper">
          <div className="ticket-mainuser-dashboard-table-container">
            <h3>Recent Tickets</h3>
            <table className="ticket-mainuser-dashboard-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Ticket No.</th>
                  <th>Date Created</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>IT In-charge</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>#0001</td>
                  <td>2026-06-10 03:10:12PM</td>
                  <td>Printer Issue</td>
                  <td>In Progress</td>
                  <td></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>#0002</td>
                  <td>2026-06-13 02:01:12PM</td>
                  <td>No Connection</td>
                  <td>Open</td>
                  <td>Jomel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* CHART */}
        <div className="ticket-mainuser-dashboard-chart-wrapper">
          <h3>Ticket Distribution</h3>
          <UserTicketDashboardChart stats={stats} />
        </div>
      </div>
    </div>
  );
}
