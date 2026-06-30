import React, { useEffect, useRef, useState } from "react";
import "../../styles/staff/Ticket_Staff_TicketAll.css";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
import { GrTroubleshoot } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function StaffAllTickets() {
  const [ticketList, setTicketList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  //REFS
  const firstRender = useRef(true);
  //EFFECTS
  useEffect(() => {
    getAllTickets("", "all");
  }, []);

  //search debounce
  useEffect(() => {
    //skip the first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      getAllTickets(search, statusFilter);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  //API
  const getAllTickets = async (searchText = "", status = "all") => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/ticketing/staff/getalltickets?search=${encodeURIComponent(searchText)}&status=${encodeURIComponent(status)}`,
    );
    const data = await response.json();
    setTicketList(data);
  };

  //HELPER FUNCTIONS
  /*   const filteredTickets = ticketList.filter((ticket) => {
    const matchesSearch =
      (ticket.ticket_num ?? "")
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim()) ||
      (ticket.subject_title ?? "")
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim()) ||
      (ticket.r_name ?? "")
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  }); */
  return (
    <div className="ticket-mainstaff-allticket-container">
      <div className="ticket-mainstaff-allticket-header-container">
        <div className="ticket-mainstaff-allticket-search-container">
          <HiMiniMagnifyingGlass className="ticket-mainstaff-allticket-search-icon" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="ticket-mainstaff-allticket-search"
            type="search"
            placeholder="Search ticket number, subject..."
          />
        </div>
        <div className="ticket-mainstaff-allticket-filter-container">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      <div className="ticket-mainstaff-allticket-content-body">
        <div className="ticket-mainstaff-allticket-content-wrapper">
          <table className="ticket-mainstaff-allticket-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Ticket No.</th>
                <th>Date Submitted</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Asset Tag</th>
                <th className="mainstaff-allticket-status-columnheader">
                  Status
                </th>
                <th>Action</th>
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
                  <td className="mainstaff-allticket-status-column">
                    <span
                      className={`mainstaff-allticket-status ${
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
                    <div className="ticket-mainstaff-allticket-table-actionbtn">
                      <button title="View Ticket">
                        <HiMiniMagnifyingGlass />
                      </button>
                      <button title="Troubleshoot Ticket">
                        <GrTroubleshoot />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td>1</td>
                <td>TK-00001</td>
                <td>06/30/2026</td>
                <td>HR</td>
                <td>Printer not working</td>
                <td>PC-1032</td>

                <td>
                  <span className="mainstaff-allticket-status open">Open</span>
                </td>
                <td>
                  <div className="ticket-mainstaff-allticket-table-actionbtn">
                    <button title="View Ticket">
                      <HiMiniMagnifyingGlass />
                    </button>
                    <button title="Troubleshoot Ticket">
                      <GrTroubleshoot />
                    </button>
                  </div>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
