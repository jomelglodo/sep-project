import React, { useEffect, useRef, useState } from "react";
import "../../styles/staff/Ticket_Staff_TicketAssigned.css";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
import { GrTroubleshoot } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function StaffAssignedTicket({ displayName }) {
  const [ticketList, setTicketList] = useState([]);
  const [search, setSearch] = useState("");

  //REFS
  const firstRender = useRef(true);
  //EFFECTS
  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchTickets();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
  //API
  const fetchTickets = async () => {
    await fetch(
      `${process.env.REACT_APP_API_URL}/ticketing/staff/allassignedtickets/${displayName}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTicketList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="ticket-mainstaff-assigned-container">
      <div className="ticket-mainstaff-assigned-header-container">
        <div className="ticket-mainstaff-assigned-search-container">
          <HiMiniMagnifyingGlass className="ticket-mainstaff-assigned-search-icon" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="ticket-mainstaff-assigned-search"
            type="search"
            placeholder="Search ticket number, subject..."
          />
        </div>

        {/* BODY */}
        <div className="ticket-mainstaff-assigned-content-body">
          <div className="ticket-mainstaff-assigned-content-wrapper">
            <table className="ticket-mainstaff-assigned-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Ticket No.</th>
                  <th>Date Submitted</th>
                  <th>Requestor</th>
                  <th>Subject</th>
                  <th>Asset Tag</th>
                  <th>Date/Time Started</th>
                  <th>Date/Time End</th>
                  <th className="mainstaff-assigned-status-columnheader">
                    Status
                  </th>
                  <th className="mainstaff-assigned-action-columnheader">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticketList.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.ticket_num}</td>
                    <td>{item.d_submitted}</td>
                    <td>{item.r_name}</td>
                    <td>{item.subject_title}</td>
                    <td>{item.asset_tag}</td>
                    <td>{item.u_time_started}</td>
                    <td>{item.u_time_finished}</td>
                    <td className="mainstaff-assigned-status-column">
                      <span
                        className={`mainstaff-assigned-status ${
                          item.status === "In Progress"
                            ? "inprogress"
                            : item.status === "Open"
                              ? "open"
                              : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="ticket-mainstaff-assigned-table-actionbtn">
                        <button
                          title="View Ticket"
                          onClick={() => {
                            handleViewTicket(item);
                          }}
                        >
                          <HiMiniMagnifyingGlass />
                        </button>
                        <button
                          title="Troubleshoot Ticket"
                          onClick={() => {
                            handleTroubleshoot(item);
                          }}
                        >
                          <GrTroubleshoot />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
