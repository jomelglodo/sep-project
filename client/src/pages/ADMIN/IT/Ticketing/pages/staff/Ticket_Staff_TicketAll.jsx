import React, { useEffect, useRef, useState } from "react";
import "../../styles/staff/Ticket_Staff_TicketAll.css";
import socket from "../../../../../../services/socket";
import { toast } from "react-toastify";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
import { GrTroubleshoot } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

//AUDIO
import toastSuccessSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";
import toastWarningSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastWarning.mp3";

export default function StaffAllTickets({ displayName, loggedinUserId }) {
  const [ticketList, setTicketList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  //ATTACHMENT
  const [showImage, setShowImage] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  //MODAL STATE
  const [ticketId, setTicketId] = useState("");
  const [ticketNum, setTicketNum] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [requestor, setRequestor] = useState("");
  const [faTag, setFaTag] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  //MODALS
  const [modalViewTicket, setModalViewTicket] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [modalConfirmTroubleshoot, setModalConfirmTroubleshoot] =
    useState(false);

  //AUDIO
  const toastSuccessAudio = new Audio(toastSuccessSound);
  const toastWarningAudio = new Audio(toastWarningSound);

  //REFS
  const firstRender = useRef(true);
  const isStarting = useRef(false);

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

  /* SOCKET IO */
  //  {#9a8,11}
  useEffect(() => {
    const refresh = () => {
      getAllTickets(search, statusFilter);
    };

    socket.on("ticket-created", refresh);
    return () => {
      socket.off("ticket-created");
    };
  }, []);

  //API
  const getAllTickets = async (searchText = "", status = "all") => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/ticketing/staff/getalltickets?search=${encodeURIComponent(searchText)}&status=${encodeURIComponent(status)}`,
    );
    const data = await response.json();
    setTicketList(data);
  };

  //HANDLER FUNCTION

  function handleViewTicket(item) {
    setTicketNum(item.ticket_num);
    setDateSubmitted(item.d_submitted);
    setRequestor(item.r_name);
    setFaTag(item.asset_tag);
    setSubject(item.subject_title);
    setStatus(item.status);
    setDescription(item.description);

    if (item.has_attachment) {
      setShowImage(true);
    }

    setModalViewTicket(true);
  }

  function handleTroubleshoot(item) {
    if (item.status.toLowerCase().trim() !== "open") {
      toast.warning("Only ticket with status OPEN can troubleshoot!");
      toastWarningAudio.play();
      return;
    }

    setTicketId(item.ticket_id);
    setTicketNum(item.ticket_num);
    setModalConfirmTroubleshoot(true);
  }

  async function handleConfirmTroubleshoot() {
    if (isStarting.current) return;

    isStarting.current = true;

    try {
      const response = await fetch(
        `
        ${process.env.REACT_APP_API_URL}/ticketing/staff/starttroubleshoot/${ticketNum}
        `,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId,
            loggedinUserId: loggedinUserId,
            staffName: displayName,
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setTicketId("");
        setTicketNum("");
        setModalConfirmTroubleshoot(false);
        getAllTickets();
        toast.success("Ticket is now In Progress");
        toastSuccessAudio.play();
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    } finally {
      isStarting.current = false;
    }
  }
  //HELPER FUNCTIONS
  function resetHooks() {
    setTicketNum("");
    setDateSubmitted("");
    setRequestor("");
    setFaTag("");
    setSubject("");
    setDescription("");
    setStatus("");
  }

  return (
    <div className="ticket-mainstaff-allticket-container">
      {modalConfirmTroubleshoot && (
        <div className="ticket-mainstaff-allticket-troubleshoot-overlay">
          <div className="ticket-mainstaff-allticket-troubleshoot-modal">
            <div className="ticket-mainstaff-allticket-troubleshoot-header">
              <h3>Confirmation</h3>
              <label>
                {`Are you sure you want to start the troubleshooting of ticket number`}{" "}
              </label>
              <label>{ticketNum}</label>
            </div>

            <div className="ticket-mainstaff-allticket-troubleshoot-button">
              <button
                className="ticket-mainstaff-allticket-troubleshoot-proceed"
                onClick={() => {
                  handleConfirmTroubleshoot();
                }}
              >
                Proceed
              </button>
              <button
                onClick={() => {
                  setModalConfirmTroubleshoot(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageViewer && (
        <div
          className="ticket-mainstaff-allticket-imageviewer-overlay"
          onClick={() => setShowImageViewer(false)}
        >
          <img
            src={imageUrl}
            alt="Attachment Image"
            className="ticket-mainstaff-allticket-imageviewer-image"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="ticket-mainstaff-allticket-imageviewer-close"
            onClick={() => setShowImageViewer(false)}
          >
            X
          </button>
        </div>
      )}
      {modalViewTicket && (
        <div className="ticket-mainstaff-allticket-viewticket-overlay">
          <div className="ticket-mainstaff-allticket-viewticket-modal">
            <div className="ticket-mainstaff-allticket-viewticket-header">
              <div>
                <h2>Ticket Details</h2>
                <p>{ticketNum}</p>
              </div>
              <span
                className={`ticket-mainstaff-allticket-viewticket-status ${status === "Open" ? "open" : status === "In Progress" ? "inprogress" : status === "Closed" ? "closed" : "cancelled"}`}
              >
                {status}
              </span>
            </div>
            <div className="ticket-mainstaff-allticket-viewticket-grid">
              <div className="ticket-mainstaff-allticket-viewticket-field">
                <label>Ticket No.</label>
                <span>{ticketNum ? ticketNum : "-"}</span>
              </div>
              <div className="ticket-mainstaff-allticket-viewticket-field">
                <label>Date Submitted</label>
                <span>{dateSubmitted ? dateSubmitted : "-"}</span>
              </div>
              <div className="ticket-mainstaff-allticket-viewticket-field">
                <label>Requestor</label>
                <span>{requestor ? requestor : "-"}</span>
              </div>
              <div className="ticket-mainstaff-allticket-viewticket-field">
                <label>Fa Tag</label>
                <span>{faTag ? faTag : "-"}</span>
              </div>
              <div className="ticket-mainstaff-allticket-viewticket-field full">
                <label>Subject</label>
                <span>{subject ? subject : "-"}</span>
              </div>
              <div className="ticket-mainstaff-allticket-viewticket-field full">
                <label>Description</label>
                <textarea readOnly value={description || ""} />
              </div>
              <div className="ticket-mainstaff-allticket-viewticket-field full">
                <label>Attachment</label>
                <div className="ticket-mainstaff-allticket-viewticket-attachment">
                  {showImage && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/ticketing/staff/getattachment/${ticketNum}`}
                      alt="Attachment Preview"
                      onClick={() => {
                        setImageUrl(
                          `${process.env.REACT_APP_API_URL}/ticketing/staff/getattachment/${ticketNum}`,
                        );
                        setShowImageViewer(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="ticket-mainsaff-allticket-viewticket-footer">
              <button
                onClick={() => {
                  resetHooks();
                  setShowImage(false);
                  setModalViewTicket(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
            <colgroup>
              <col style={{ width: "60px" }} /> {/* No. */}
              <col style={{ width: "120px" }} />
              {/* Ticket no. */}
              <col style={{ width: "150px" }} />
              {/* Date submitted */}
              <col style={{ width: "120px" }} />
              {/* Requestor */}
              <col /> {/* Subject expands based on the css*/}
              <col style={{ width: "130px" }} />
              {/* Asset tag. */}
              <col style={{ width: "120px" }} />
              {/* status */}
              <col style={{ width: "100px" }} />
              {/* action */}
            </colgroup>
            <thead>
              <tr>
                <th>No.</th>
                <th>Ticket No.</th>
                <th>Date Submitted</th>
                <th>Requestor</th>
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
                  <td className="mainstaff-allticket-subject-column">
                    {item.subject_title}
                  </td>
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
