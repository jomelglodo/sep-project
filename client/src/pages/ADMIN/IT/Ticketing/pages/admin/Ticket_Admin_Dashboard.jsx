import React, { useState, useRef, useEffect } from "react";
import "../../styles/admin/Ticket_Admin_Dashboard.css";
import axios from "axios";

//ICONS
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { TbTicketOff } from "react-icons/tb";

import AnnouncementDashboard from "./announcement/components/dashboard/AnnouncementDashboard";
import Ticket_Admin_TicketChart from "./Ticket_Admin_TicketChart";

export default function MainAdminDashboard() {
  const [ticketList, setTIcketList] = useState([]);
  const [counterTickets, setCounterTickets] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    closed: 0,
    cancelled: 0,
  });

  async function getDashboardData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/ticketing/admin/dashboard`,
      );

      const data = response.data;
      setCounterTickets(data.count);
      setTIcketList(data.recentTickets);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="ticket-mainadmin-dashboard-container">
      <h2 className="ticket-mainadmin-dashboard-title"> Ticket Dashboard</h2>
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
          <section className="ticket-mainadmin-dashboard-grid">
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
                    {ticketList.map((item, index) => (
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
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CHART */}
            <div className="ticket-mainadmin-dashboard-chart-wrapper ticket-mainstaff-card">
              <h3 className="ticket-mainadmin-dashboard-chart-title">
                Ticket Status
              </h3>
              <Ticket_Admin_TicketChart data={counterTickets} />
            </div>
          </section>

          <section>
            <AnnouncementDashboard />
          </section>
        </div>
      </div>
    </div>
  );
}
