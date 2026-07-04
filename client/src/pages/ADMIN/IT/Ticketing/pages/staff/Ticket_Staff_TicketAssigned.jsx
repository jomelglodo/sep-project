import React, { useEffect, useRef, useState } from "react";
import "../../styles/staff/Ticket_Staff_TicketAssigned.css";
import { toast } from "react-toastify";
import socket from "../../../../../../services/socket";

//PAGES
import EditTicketPage from "./Ticket_Staff_TicketAssignedEdit";

//ICONS
import { FaListAlt, FaUserCheck, FaStickyNote } from "react-icons/fa";
import { GrTroubleshoot } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";

//AUDIO
import toastSuccessSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";
import toastWarningSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastWarning.mp3";

export default function StaffAssignedTicket({ displayName }) {
  const [selectedItem, setSelectedItem] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [search, setSearch] = useState("");

  //ATTACHMENT
  const [showImage, setShowImage] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);

  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  //MODAL STATE
  const [ticketId, setTicketId] = useState("");
  const [ticketNum, setTicketNum] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [requestor, setRequestor] = useState("");
  const [faTag, setFaTag] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");

  //STAFF REASON/COMMENT
  const [staffReason, setStaffReason] = useState("");

  //MODAL
  const [modalViewTicket, setModalViewTicket] = useState(false);
  const [modalEditTicket, setModalEditTicket] = useState(false);

  //REFS
  const firstRender = useRef(true);
  const reasonFocus = useRef(null);
  const attachmentInputRef = useRef(null);

  //AUDIO
  const toastSuccessAudio = new Audio(toastSuccessSound);
  const toastWarningAudio = new Audio(toastWarningSound);

  //EFFECTS

  //REASON FOCUS
  useEffect(() => {
    if (reasonFocus.current) {
      reasonFocus.current?.focus();
    }
  }, [modalViewTicket]);

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

  //  {#4f5,15}
  //refresh ticketlist if the selected ticket is closed
  useEffect(() => {
    const refresh = (data) => {
      fetchTickets();

      toastSuccessAudio.play();
      toast.success(`Ticket: ${data.ticketNum} is now closed `);
    };

    socket.on("ticket-finished", refresh);

    return () => {
      socket.off("ticket-finished", refresh);
    };
  }, [modalViewTicket]);

  //API
  const fetchTickets = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/staff/allassignedtickets/${displayName}`,
      );

      const data = await res.json();
      setTicketList(data);
    } catch (err) {
      console.error(err);
    }
  };

  //HANDLER FUNCTION
  function handleEditTicket(item) {
    if (item.status === "In Progress") {
      toastWarningAudio.play();
      toast.info("A ticket that is already In Progress cannot be edited");
      return;
    }

    setSelectedItem(item);

    setModalEditTicket(true);
  }

  const renderEditModal = () => {
    return (
      <EditTicketPage
        onClose={() => {
          setModalEditTicket(false);
          setSelectedItem([]);
        }}
        item={selectedItem}
        refreshTicketList={fetchTickets}
      />
    );
  };

  function handleViewTicket(item) {
    setTicketNum(item.t_ticket_num);
    setDateSubmitted(item.d_submitted);
    setRequestor(item.r_name);
    setFaTag(item.asset_tag);
    setSubject(item.subject_title);
    setStatus(item.status);
    setStaffReason(item.update_comment);
    setHasAttachment(item.has_updateattachment);

    if (item.has_updateattachment) {
      setShowImage(true);
    }

    //show image if the status is closed
    if (item.status === "Closed") {
      setAttachmentPreview(
        `${process.env.REACT_APP_API_URL}/ticketing/staff/getupdateattachment/${item.t_ticket_num}?t=${Date.now()}`,
      );
    }

    setModalViewTicket(true);
  }

  async function handleFinishTicket() {
    if (!staffReason) {
      toastWarningAudio.play();
      toast.info(`Please provide a "Reason/Comment" to finish`);
      if (reasonFocus.current) {
        reasonFocus.current?.focus();
      }
      return;
    }

    const formData = new FormData();

    formData.append("reason", staffReason);

    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/staff/finishticket/${ticketNum}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        resetAttachment();
        resetSelection();
        setModalViewTicket(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }

  function handleAttachment(file) {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toastWarningAudio.play();
      toast.warning("Only PNG, JPG and JPEG files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastWarningAudio.play();
      toast.warning("Maximum file size is 5 MB.");
      return;
    }

    setAttachmentFile(file);
    setAttachmentPreview(URL.createObjectURL(file));
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleAttachment(file);
  }

  function handleBrowse(e) {
    const file = e.target.files[0];

    handleAttachment(file);
  }

  function removeAttachment() {
    setAttachmentFile(null);

    setAttachmentPreview("");

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  function resetAttachment() {
    setAttachmentFile(null);
    setAttachmentPreview("");
    setIsDragging(false);

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  //HELPER

  const resetSelection = () => {
    setTicketNum("");
    setDateSubmitted("");
    setRequestor("");
    setFaTag("");
    setSubject("");
    setStatus("");
    setStaffReason("");
    setHasAttachment(false);
  };

  const filteredTickets = ticketList.filter((ticket) => {
    const keyword = search.toLowerCase();

    return (
      ticket.t_ticket_num.toLowerCase().includes(keyword) ||
      ticket.subject_title.toLowerCase().includes(keyword) ||
      ticket.r_name.toLowerCase().includes(keyword)
    );
  });
  return (
    <div className="ticket-mainstaff-assigned-container">
      {showImageViewer && (
        <div
          className="ticket-mainstaff-assigned-imageviewer-overlay"
          onClick={() => setShowImageViewer(false)}
        >
          <img
            src={attachmentPreview}
            alt="Attachment Image"
            className="ticket-mainstaff-assigned-imageviewer-image"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="ticket-mainstaff-assigned-imageviewer-close"
            onClick={() => setShowImageViewer(false)}
          >
            X
          </button>
        </div>
      )}
      {modalEditTicket && renderEditModal()}
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
                <label>Comment/Reason (IT Staff)</label>
                <textarea
                  ref={reasonFocus}
                  value={staffReason}
                  onChange={(e) => {
                    setStaffReason(e.target.value);
                  }}
                />
              </div>
              <div className="ticket-mainstaff-assigned-viewticket-field full">
                <label>Attachment (IT Staff)</label>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleBrowse}
                />

                {!attachmentPreview ? (
                  <div
                    className={`ticket-mainstaff-assigned-upload ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="ticket-mainstaff-assigned-upload-icon">
                      📤
                    </div>
                    <h4>Drag & Drop Image</h4>
                    <p>or</p>
                    <button
                      type="button"
                      onClick={() => attachmentInputRef.current.click()}
                    >
                      Select Image
                    </button>
                    <small>
                      PNG,JPG or JPEG
                      <br />
                      Maximum file size: 5 MB
                    </small>
                  </div>
                ) : attachmentPreview &&
                  status.trim().toLocaleLowerCase() === "closed" ? (
                  hasAttachment ? (
                    <div className="ticket-mainstaff-assigned-upload-preview">
                      <img
                        src={attachmentPreview}
                        alt="Attachment Preview"
                        onClick={() => {
                          setShowImageViewer(true);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="ticket-mainstaff-assigned-upload-preview">
                      <i>No Attachment</i>
                    </div>
                  )
                ) : (
                  <div className="ticket-mainstaff-assigned-upload-preview">
                    <img
                      src={attachmentPreview}
                      alt="Attachment Preview"
                      onClick={() => {
                        setShowImageViewer(true);
                      }}
                    />

                    <div className="ticket-mainstaff-assigned-upload-actions">
                      <button
                        type="button"
                        onClick={() => attachmentInputRef.current.click()}
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        className="ticket-mainstaff-assigned-upload-removebtn"
                        onClick={removeAttachment}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="ticket-mainsaff-assigned-viewticket-footer">
              {status.toLowerCase() === "in progress" && (
                <button
                  className="ticket-mainstaff-assigned-viewticket-finishtbtn"
                  onClick={() => {
                    handleFinishTicket();
                  }}
                >
                  Finish
                </button>
              )}

              <button
                className="ticket-mainstaff-assigned-viewticket-closetbtn"
                onClick={() => {
                  resetAttachment();
                  resetSelection();

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
                <col style={{ width: "150px" }} />
                {/* Time Started */}
                <col style={{ width: "150px" }} />
                {/* Time end */}
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
                  <th>Time Started</th>
                  <th>Time End</th>
                  <th className="mainstaff-assigned-status-columnheader">
                    Status
                  </th>
                  <th className="mainstaff-assigned-action-columnheader">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.t_ticket_num}</td>
                    <td>{item.d_submitted}</td>
                    <td>{item.r_name}</td>
                    <td className="mainstaff-assigned-subject-column">
                      {item.subject_title}
                    </td>
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
                          title="Edit Ticket"
                          onClick={() => {
                            handleEditTicket(item);
                          }}
                        >
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
