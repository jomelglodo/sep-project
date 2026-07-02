import React, { useEffect, useRef, useState } from "react";
import "../../styles/staff/Ticket_Staff_TicketAssigned.css";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
import { GrTroubleshoot } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";

//AUDIO
import toastSuccessSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";

export default function StaffAssignedTicket({ displayName }) {
  const [ticketList, setTicketList] = useState([]);
  const [search, setSearch] = useState("");

  //ATTACHMENT
  const [showImage, setShowImage] = useState(false);

  //MODAL STATE
  const [ticketId, setTicketId] = useState("");
  const [ticketNum, setTicketNum] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [requestor, setRequestor] = useState("");
  const [faTag, setFaTag] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  //MODAL
  const [modalViewTicket, setModalViewTicket] = useState(false);

  //REFS
  const firstRender = useRef(true);

  //AUDIO
  const toastSuccessAudio = new Audio(toastSuccessSound);
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

  //HANDLER FUNCTION
  function handleViewTicket(item) {
    setTicketNum(item.t_ticket_num);
    setDateSubmitted(item.d_submitted);
    setRequestor(item.r_name);
    setFaTag(item.asset_tag);
    setSubject(item.subject_title);
    setDescription(item.description);
    setStatus(item.status);

    setModalViewTicket(true);
  }
  return (
    <div className="ticket-mainstaff-assigned-container">
      {modalViewTicket && (
        <div className="ticket-mainstaff-assigned-viewticket-overlay">
          <div className="ticket-mainstaff-assigned-viewticket-modal">
            <div className="ticket-mainstaff-assigned-viewticket-header">
              <div>
                <h2>Ticket Details</h2>
                <p>{ticketNum}</p>
              </div>
              <span
                className={`ticket-mainstaff-assigned-viewticket-status ${status === "Open" ? "open" : status === "In Progress" ? "inprogress" : status === "Closed" ? "closed" : "cancelled"}`}
              >
                {status}
              </span>
            </div>
            <div className="ticket-mainstaff-assigned-viewticket-grid">
              <div className="ticket-mainstaff-assigned-viewticket-field">
                <label>Ticket No.</label>
                <span>{ticketNum ? ticketNum : "-"}</span>
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field">
                <label>Date Submitted</label>
                <span>{dateSubmitted ? dateSubmitted : "-"}</span>
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field">
                <label>Requestor</label>
                <span>{requestor ? requestor : "-"}</span>
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field">
                <label>Fa Tag</label>
                <span>{faTag ? faTag : "-"}</span>
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field full">
                <label>Subject</label>
                <span>{subject ? subject : "-"}</span>
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field full">
                <label>Description</label>
                <textarea readOnly value={description || ""} />
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field full">
                <label>Attachment</label>
                <div className="ticket-mainstaff-assigned-viewticket-attachment">
                  {showImage && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/ticketing/staff/getattachment/${ticketNum}`}
                      alt="Attachment Preview"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="ticket-mainsaff-assigned-viewticket-footer">
              <button className="ticket-mainstaff-assigned-viewticket-startbtn">
                Start
              </button>
              <button
                className="ticket-mainstaff-assigned-viewticket-closetbtn"
                onClick={() => {
                  setModalViewTicket(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticketList.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.t_ticket_num}</td>
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
                        <button title="Edit Ticket">
                          <FaEdit />
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
