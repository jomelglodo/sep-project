import React, { useState, useRef, useEffect } from "react";
import "../../styles/staff/Ticket_Staff_TicketAssignedEdit.css";

import { toast } from "react-toastify";

import toastSuccessSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";
import toastWarningSound from "../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastWarning.mp3";

export default function AssignedTicketEdit({
  onClose,
  item,
  refreshTicketList,
}) {
  //ATTACHMENT
  const [showImage, setShowImage] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);
  const [isRemoveAttachment, setIsRemoveAttachment] = useState(false);

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
  const [modalConfirmSave, setModalConfirmSave] = useState(false);

  //AUDIO
  const toastSuccessAudio = new Audio(toastSuccessSound);
  const toastWarningAudio = new Audio(toastWarningSound);

  //REFS
  const reasonFocus = useRef(null);
  const attachmentInputRef = useRef(null);

  //EFFECTS
  useEffect(() => {
    setTicketNum(item.t_ticket_num);
    setDateSubmitted(item.d_submitted);
    setRequestor(item.r_name);
    setFaTag(item.asset_tag);
    setSubject(item.subject_title);
    setStatus(item.status);
    setStaffReason(item.update_comment);
    setHasAttachment(item.has_updateattachment);

    if (item.has_updateattachment) {
      setAttachmentPreview(
        `${process.env.REACT_APP_API_URL}/ticketing/staff/getupdateattachment/${item.t_ticket_num}?t=${Date.now()}`,
      );
    }
  }, []);

  //HANDLER FUNCTIONS
  function handleSaveChanges() {
    if (!staffReason) {
      toastWarningAudio.play();
      toast.warning("Please enter the reason!");
      return;
    }
    setModalConfirmSave(true);
  }

  async function handleConfirmSave() {
    const formData = new FormData();

    try {
      formData.append("reason", staffReason);

      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      if (isRemoveAttachment) {
        formData.append("isremove", isRemoveAttachment.toString());
      }

      const response = await fetch(
        `
            ${process.env.REACT_APP_API_URL}/ticketing/staff/saveeditdetails/${ticketNum}
            `,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        await refreshTicketList();
        resetSelection();
        setModalConfirmSave(false);
        onClose();

        toastSuccessAudio.play();
        toast.success(data.message);
      }
    } catch (err) {
      console.error(err);
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

    setIsRemoveAttachment(false);
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

    if (hasAttachment) {
      setIsRemoveAttachment(true);
    }

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
    setIsRemoveAttachment(false);
  };

  return (
    <div className="ticket-mainstaff-assigned-editticket-overlay">
      {showImageViewer && (
        <div
          className="ticket-mainstaff-assigned-imageviewer-editticket-overlay"
          onClick={() => setShowImageViewer(false)}
        >
          <img
            src={attachmentPreview}
            alt="Attachment Image"
            className="ticket-mainstaff-assigned-imageviewer-editticket-image"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="ticket-mainstaff-assigned-imageviewer-editticket-close"
            onClick={() => setShowImageViewer(false)}
          >
            X
          </button>
        </div>
      )}
      {modalConfirmSave && (
        <div className="ticket-mainstaff-assigned-editticket-confirm-overlay">
          <div className="ticket-mainstaff-assigned-editticket-confirm-modal">
            <div className="ticket-mainstaff-assigned-editticket-confirm-header">
              <h2>Confirmation</h2>
              <p>Are you sure you want to save the changes ?</p>
            </div>
            <div className="ticket-mainstaff-assigned-editticket-confirm-button-container">
              <button
                className="ticket-mainstaff-assigned-editticket-confirm-yesbtn"
                onClick={handleConfirmSave}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setModalConfirmSave(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="ticket-mainstaff-assigned-editticket-modal">
        <div className="ticket-mainstaff-assigned-editticket-header">
          <div>
            <h2>Ticket Details</h2>
            <p>{ticketNum}</p>
          </div>
          <span
            className={`ticket-mainstaff-assigned-editticket-status ${status === "Open" ? "open" : status === "In Progress" ? "inprogress" : status === "Closed" ? "closed" : "cancelled"}`}
          >
            {status}
          </span>
        </div>
        <div className="ticket-mainstaff-assigned-editticket-grid">
          <div className="ticket-mainstaff-assigned-editticket-field">
            <label>Ticket No.</label>
            <span>{ticketNum ? ticketNum : "-"}</span>
          </div>
          <div className="ticket-mainstaff-assigned-editticket-field">
            <label>Date Submitted</label>
            <span>{dateSubmitted ? dateSubmitted : "-"}</span>
          </div>
          <div className="ticket-mainstaff-assigned-editticket-field">
            <label>Requestor</label>
            <span>{requestor ? requestor : "-"}</span>
          </div>
          <div className="ticket-mainstaff-assigned-editticket-field">
            <label>Fa Tag</label>
            <span>{faTag ? faTag : "-"}</span>
          </div>
          <div className="ticket-mainstaff-assigned-editticket-field full">
            <label>Subject</label>
            <span>{subject ? subject : "-"}</span>
          </div>
          <div className="ticket-mainstaff-assigned-editticket-field full">
            <label>Comment/Reason (IT Staff)</label>
            <textarea
              ref={reasonFocus}
              value={staffReason}
              onChange={(e) => {
                setStaffReason(e.target.value);
              }}
            />
          </div>
          <div className="ticket-mainstaff-assigned-editticket-field full">
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
                className={`ticket-mainstaff-assigned-editticket-upload ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="ticket-mainstaff-assigned-editticket-upload-icon">
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
            ) : (
              <div className="ticket-mainstaff-assigned-editticket-upload-preview">
                <img
                  src={attachmentPreview}
                  alt="Attachment Preview"
                  onClick={() => {
                    setShowImageViewer(true);
                  }}
                />

                <div className="ticket-mainstaff-assigned-editticket-upload-actions">
                  <button
                    type="button"
                    onClick={() => attachmentInputRef.current.click()}
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    className="ticket-mainstaff-assigned-editticket-upload-removebtn"
                    onClick={removeAttachment}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="ticket-mainsaff-assigned-editticket-footer">
          <button
            className="ticket-mainstaff-assigned-editticket-savebtn"
            onClick={() => {
              handleSaveChanges();
            }}
          >
            Save
          </button>

          <button
            className="ticket-mainstaff-assigned-editticket-closetbtn"
            onClick={() => {
              resetAttachment();
              resetSelection();

              setShowImage(false);
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
