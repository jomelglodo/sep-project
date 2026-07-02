import React, { useState, useEffect, useRef } from "react";
import "../../styles/user/Ticket_User_Dashboard.css";
import { toast } from "react-toastify";
import UserTicketDashboardChart from "./Ticket_User_DashboardChart";
import socket from "../../../../../../services/socket";

//ICONS
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { TbTicketOff } from "react-icons/tb";

export default function MainUserDashBoard({ displayName, loggedinUserId }) {
  const [ticketList, setTicketList] = useState([]);

  const [counterTicket, setCounterTicket] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    cancelled: 0,
    closed: 0,
  });

  useEffect(() => {
    // simulate API
    const fetchTicketCount = () => {
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
    };

    fetchTicketCount();

    socket.on("ticket-created", fetchTicketCount);
    socket.on("ticket-starttroubleshoot", fetchTicketCount);

    return () => {
      socket.off("ticket-created");
      socket.off("ticket-starttroubleshoot");
    };
  }, [loggedinUserId]);

  useEffect(() => {
    fetchTickets();
  }, []);

  //  {#705,22}
  //socket.io

  useEffect(() => {
    const fetchCreatedTicket = () => {
      fetchTickets();
    };
    const fetchStarttroubleshoot = (data) => {
      fetchTickets();
      //show a notification
      toast.info(
        `${data.ticketNum} is now In Progress, Assigned IT: ${data.staffName}`,
      );
    };
    socket.on("ticket-created", fetchCreatedTicket);
    socket.on("ticket-starttroubleshoot", fetchStarttroubleshoot);

    return () => {
      socket.off("ticket-created", fetchCreatedTicket);
      socket.off("ticket-starttroubleshoot", fetchStarttroubleshoot);
    };
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
  return (
    <div className="ticket-mainuser-dashboard-container">
      <h2 className="ticket-mainuser-dashboard-title">Dashbord</h2>
      {/* TICKET COUNTER */}
      <div className="ticket-mainuser-dashboard-ticketcounter-container">
        <div className="ticket-mainuser-dashboard-ticketcounter-group total">
          <div className="ticket-mainuser-dashboard-count">
            <h3>{counterTicket.total}</h3>
            <p>Total Tickets</p>
          </div>

          <BsFillTicketPerforatedFill />
        </div>
        <div className="ticket-mainuser-dashboard-ticketcounter-group open">
          <div className="ticket-mainuser-dashboard-count">
            <h3>{counterTicket.open}</h3>
            <p>Open Tickets</p>
          </div>

          <FaFolderOpen />
        </div>
        <div className="ticket-mainuser-dashboard-ticketcounter-group inprogress">
          <div className="ticket-mainuser-dashboard-count">
            <h3>{counterTicket.inprogress}</h3>
            <p>In Progress</p>
          </div>

          <FaClock />
        </div>
        <div className="ticket-mainuser-dashboard-ticketcounter-group closed">
          <div className="ticket-mainuser-dashboard-count">
            <h3>{counterTicket.closed}</h3>
            <p>Closed</p>
          </div>

          <FaCheckSquare />
        </div>
        <div className="ticket-mainuser-dashboard-ticketcounter-group cancelled">
          <div className="ticket-mainuser-dashboard-count">
            <h3>{counterTicket.cancelled}</h3>
            <p>Cancelled</p>
          </div>

          <TbTicketOff />
        </div>
      </div>
      <div className="ticket-mainuser-dashboard-statistics">
        {/* RECENT TICKET TABLE */}
        <div className="ticket-mainuser-dashboard-table-wrapper">
          <h3>Recent Tickets</h3>
          <div className="ticket-mainuser-dashboard-table-container">
            <table className="ticket-mainuser-dashboard-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Ticket No.</th>
                  <th>Date Created</th>
                  <th>Subject</th>
                  <th className="ticket-mainuser-dashboard-status-columnheader">
                    Status
                  </th>
                  <th>IT In-charge</th>
                </tr>
              </thead>
              <tbody>
                {ticketList.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.ticket_num_ticket}</td>
                    <td>{item.date_submitted}</td>
                    <td>{item.subject_title}</td>
                    <td>
                      <span
                        className={`ticket-mainuser-dashboard-status-column ${item.status === "In Progress" ? "inprogress" : ""}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.staff_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* CHART */}
        <div className="ticket-mainuser-dashboard-chart-wrapper">
          <h3>Ticket Distributions</h3>
          <UserTicketDashboardChart ticketStats={counterTicket} />
        </div>
      </div>
    </div>
  );
}
