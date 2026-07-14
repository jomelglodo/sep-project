import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../styles/staff/Ticket_Staff_Dashboard.css";
import { toast } from "react-toastify";
import socket from "../../../../../../services/socket";

//chart
import DashboardChart from "./Ticket_Staff_DashboardChart";

//ICONS
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { TbTicketOff } from "react-icons/tb";

export default function MainStaffDashBoard({ displayName }) {
  const [ticketList, setTicketList] = useState([]);
  const [staffName, setStaffName] = useState("");

  const [counterTickets, setCounterTickets] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    cancelled: 0,
    closed: 0,
  });

  //EFFECTS

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

  useEffect(() => {
    fetchDashboardCounter();
    fetchTableTickets();
  }, [staffName]);

  //  {#e34,12}
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

  //API

  //fetch dashboard ticket counters
  const fetchDashboardCounter = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ticketing/staff/getcounter`,
        {
          staffName: displayName,
        },
      );

      if (response.data.success) {
        setCounterTickets(response.data.counts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //fetch table tickets data

  const fetchTableTickets = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/staff/populatetickets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staffName: displayName,
          }),
        },
      );

      const data = await response.json();
      setTicketList(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ticket-mainstaff-dashboard-container">
      <h2 className="ticket-mainstaff-dashboard-title">Dashboard</h2>
      {/* TICKET COUNTER */}

      <div className="ticket-mainstaff-dashboard-ticketcounter-container">
        <div className="ticket-mainstaff-dashboard-ticketcounter-group total">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTickets.total}</h3>
            <p>Total Tickets</p>
          </div>

          <BsFillTicketPerforatedFill />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group open">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTickets.open}</h3>
            <p>Open Tickets</p>
          </div>

          <FaFolderOpen />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group inprogress">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTickets.inprogress}</h3>
            <p>In Progress</p>
          </div>

          <FaClock />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group closed">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTickets.closed}</h3>
            <p>Closed Tickets</p>
          </div>

          <FaCheckSquare />
        </div>
        <div className="ticket-mainstaff-dashboard-ticketcounter-group cancelled">
          <div className="ticket-mainstaff-dashboard-count">
            <h3>{counterTickets.cancelled}</h3>
            <p>Cancelled</p>
          </div>

          <TbTicketOff />
        </div>
      </div>
      <div className="ticket-mainstaff-dashboard-body">
        <div className="ticket-mainstaff-dashboard-statistics">
          {/* RECENT TICKET TABLE */}
          <div className="ticket-mainstaff-dashboard-table-wrapper ticket-mainstaff-card">
            <h3 className="ticket-mainstaff-dashboard-table-title">
              Assign Tickets
            </h3>
            <div className="ticket-mainstaff-dashboard-table-container">
              <table className="ticket-mainstaff-dashboard-table">
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
                          {" "}
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
          <div className="ticket-mainstaff-dashboard-chart-wrapper ticket-mainstaff-card">
            <h3 className="ticket-mainstaff-dashboard-chart-title">
              Ticket Status
            </h3>
            <DashboardChart ticketCounts={counterTickets} />
          </div>

          <div className="ticket-mainstaff-dashboard-performancemetric ticket-mainstaff-card">
            <h3 className="ticket-mainstaff-dashboard-performancemetric-title">
              Performance Metric
            </h3>
            <div className="ticket-mainstaff-dashboard-performancemetric-breakdown">
              <div className="ticket-mainstaff-dashboard-performancemetric-total mainstaff-performancemetric-group">
                <p>Total Assigned : </p>
                <h3>0</h3>
              </div>

              <div className="ticket-mainstaff-dashboard-performancemetric-resolved mainstaff-performancemetric-group">
                <p>Resolved Today : </p>
                <h3>0</h3>
              </div>

              <div className="ticket-mainstaff-dashboard-performancemetric-average mainstaff-performancemetric-group">
                <p>Average Resolution : </p>
                <h3>0</h3>
              </div>

              <div className="ticket-mainstaff-dashboard-performancemetric-SLA mainstaff-performancemetric-group">
                <p>SLA Compliance : </p>
                <h3>0</h3>
              </div>
            </div>
          </div>

          <div className="ticket-mainstaff-dashboard-performanceactivity-container ticket-mainstaff-card">
            <h3 className="ticket-mainstaff-dashboard-performanceactivity-title">
              Recent Activity
            </h3>
            <div className="ticket-mainstaff-dashboard-performanceactivity-body">
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
