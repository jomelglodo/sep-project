import React, { useEffect, useRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import "../../styles/user/Ticket_MainUser_Ticket.css";

export default function MainUserTicket({ displayName, loggedinUserId }) {
  const [search, setSearch] = useState("");
  //list variables
  const [assetList, setAssetList] = useState([]);
  const [ticketList, setTicketList] = useState([]);

  //DATA STORAGE
  /* Create ticket */
  const [curDate, setCurDate] = useState("");
  const [asset, setAsset] = useState("");
  const [faTag, setFaTag] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();
  const [previewUrlEdit, setPreviewUrlEdit] = useState("");

  /* Edit Ticket */
  const [editDateSubmitted, setEditDateSubmitted] = useState("");
  const [editAsset, setEditAsset] = useState("");
  const [editFaTag, setEditFaTag] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [editAttachment, setEditAttachment] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState();
  const [editPreviewUrlEdit, setEditPreviewUrlEdit] = useState("");

  const [editHasAttachment, setEditHasAttachment] = useState(false);
  const [editAttachmentFilename, setEditAttachmentFilename] = useState("");

  const [selectedTicketNum, setSelectedTicketNum] = useState("");

  //MODAL
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showCancelTicket, setShowCancelTicket] = useState(false);
  const [showEditTicket, setShowEditTicket] = useState(false);

  //MODAL CONFIRMATION
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  //MODAL VARIABLE
  const [selCancelTicketNum, setSelCancelTicketNum] = useState("");

  //USEREF
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  //GET THE CURRENT DATE (FORMATTED : yyyyMM-dd)

  function getCurrentDate() {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  //reset form and populate assets
  useEffect(() => {
    if (showCreateTicket) {
      resetForm();

      //get the current date
      setCurDate(getCurrentDate());
    }

    //populate asset
    fetch(`${process.env.REACT_APP_API_URL}/ticketing/user/ticket/getassets`)
      .then((res) => res.json())
      .then((data) => {
        setAssetList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [showCreateTicket]);

  //populate tickets using poll and runs only when the user view Ticket Page
  useEffect(() => {
    let interval;

    const fetchIfVisible = async () => {
      if (document.visibilityState === "visible") {
        await fetchTickets();
      }
    };
    //initial load if visible
    fetchTickets();
    interval = setInterval(() => {
      fetchIfVisible();
    }, 5000);

    return () => clearInterval(interval);
  }, [search]);

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

  function handleCancelledTicket(item) {
    if (item.status !== "Open") {
      alert(`Only ticket with status "OPEN" can be cancelled!`);
      return;
    }
    setSelCancelTicketNum(item.ticket_num_ticket);
    setShowCancelTicket(true);
  }

  async function handleConfirmCancel() {
    try {
      const response = await fetch(
        `
        ${process.env.REACT_APP_API_URL}/ticketing/user/ticket/cancelticket/${selCancelTicketNum}
        `,
        {
          method: "PUT",
        },
      );

      const data = await response.json();
      if (data.success) {
        setSelCancelTicketNum("");
        setShowCancelTicket(false);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleEditButton(item) {
    if (item.status !== "Open") {
      alert(`Only ticket with "OPEN" status can be edit`);
      return;
    }

    setEditDateSubmitted(item.d_submitted);
    setEditAsset(item.asset);
    setEditFaTag(item.asset_tag);
    setEditSubject(item.subject_title);
    setEditDescription(item.description);

    //if there is an image attachment
    setEditHasAttachment(item.has_attachment);
    setEditAttachmentFilename(item.attachment_filename);

    setSelectedTicketNum(item.ticket_num_ticket);

    setShowEditTicket(true);
  }

  function handleFileChange(e) {
    //for single image attachment
    const file = e.target.files[0];

    if (!file) return;

    if (showEditTicket) {
      setEditAttachment(file);

      const imageUrl = URL.createObjectURL(file);
      setEditPreviewUrl(imageUrl);
      return;
    }

    if (showCreateTicket) {
      setAttachment(file);

      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      return;
    }

    //multiple attachment
    // const files = Array.from(e.target.files);

    // setAttachment(files);

    // const previews = files.map((files) => URL.createObjectURL(files));

    // setPreviewUrl(previews);
  }

  /* EDIT TICKET */

  function closeEditModal() {
    resetForm();
    setShowEditTicket(false);
  }
  /* CREATE TICKET */
  function closeModal() {
    resetForm();
    setShowCreateTicket(false);
  }

  function resetForm() {
    if (showCreateTicket) {
      setAsset("");
      setFaTag("");
      setSubject("");
      setDescription("");

      setAttachment(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (showEditTicket) {
      setEditDateSubmitted("");
      setEditAsset("");
      setEditFaTag("");
      setEditSubject("");
      setEditDescription("");

      setEditAttachment(null);
      setEditHasAttachment(false);
      setEditAttachmentFilename("");

      if (editPreviewUrl) {
        URL.revokeObjectURL(editPreviewUrl);
      }

      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setShowEditConfirm(true);
  }

  function handleEditConfirm() {
    alert("submitted");
  }

  async function handleSubmitTicket(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("curDate", curDate);
    formData.append("userId", loggedinUserId);
    formData.append("displayname", displayName);
    formData.append("asset", asset);
    formData.append("faTag", faTag);
    formData.append("subject", subject);
    formData.append("description", description);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const res = await fetch(
        `
      ${process.env.REACT_APP_API_URL}/ticketing/user/ticket/createticket
      `,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        const ticketNum = data.ticketNum;
        alert(`${ticketNum} successfully created`);
        resetForm();
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  }

  //debounce for searching data
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTickets();
    }, 300);
    return clearTimeout(delay);
  }, [search]);

  //filter data when searching
  const filteredTickets = ticketList.filter((item) => {
    const keyword = search.toLowerCase().trim();

    return (
      item.ticket_num_ticket?.toLowerCase().includes(keyword) ||
      item.subject_title?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="ticket-mainuser-ticket-container">
      {/* EDIT CONFIRMATION MODAL */}
      {showEditConfirm && (
        <div className="ticket-mainuser-editconfirm-overlay">
          <div className="ticket-mainuser-editconfirm-modal">
            <div className="ticket-mainuser-editconfirm-header">
              <h2>Confirm</h2>
              <p>Are you sure you want to save the changes?</p>
            </div>
            <div className="ticket-mainuser-editconfirm-button-container">
              <button onClick={handleEditConfirm}>Yes</button>
              <button
                onClick={() => {
                  setShowEditConfirm(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CANCEL TICKET */}
      {showCancelTicket && (
        <div className="ticket-mainuser-cancelticket-overlay">
          <div className="ticket-mainuser-cancelticket-modal">
            <h2>Confirmation</h2>
            <p>Are you sure you want to cancel the selected ticket number</p>
            <p>{selCancelTicketNum}</p>
            <div className="ticket-mainuser-cancelticket-button-container">
              <button onClick={handleConfirmCancel}>Yes</button>
              <button
                onClick={() => {
                  setShowCancelTicket(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateTicket && (
        <div className="ticket-mainuser-ticket-overlay">
          <div className="ticket-mainuser-ticket-modal">
            <div className="ticket-mainuser-ticket-modal-header">
              <h2>Create Ticket</h2>
              <button
                className="ticket-mainuser-ticket-modal-closebtn"
                onClick={() => {
                  closeModal();
                }}
              >
                X
              </button>
            </div>
            <form
              className="ticket-mainuser-ticket-modal-form"
              onSubmit={handleSubmitTicket}
            >
              <div className="ticket-mainuser-ticket-modal-section">
                <h3>Request Information</h3>

                <div className="ticket-mainuser-ticket-modal-grid">
                  <div className="ticket-mainuser-ticket-modal-group">
                    <label>Date Created</label>
                    <label var={curDate}>{curDate}</label>
                  </div>

                  <div className="ticket-mainuser-ticket-modal-group">
                    <label>User Id</label>
                    <label value={loggedinUserId}>{loggedinUserId}</label>
                  </div>
                </div>
              </div>

              <div className="ticket-mainuser-ticket-modal-section">
                <h3>Asset Information</h3>

                <div className="ticket-mainuser-ticket-modal-grid">
                  <div className="ticket-mainuser-ticket-modal-group">
                    <label>Asset Type</label>

                    {/*  <input
                      type="text"
                      list="asset-list"
                      value={asset}
                      onChange={(e) => {
                        setAsset(e.target.value);
                      }}
                      placeholder="Select asset"
                    />

                    <datalist id="asset-list">
                      {assetList.map((item, index) => (
                        <option value={item.asset} key={index}></option>
                      ))}
                    </datalist> */}
                    <select
                      name=""
                      id=""
                      value={asset}
                      onChange={(e) => {
                        setAsset(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        --Select--
                      </option>
                      {assetList.map((item) => (
                        <option value={item.asset}> {item.asset}</option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-mainuser-ticket-modal-group">
                    <label>FA-Tag</label>
                    <input
                      type="text"
                      value={faTag}
                      onChange={(e) => {
                        setFaTag(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="ticket-mainuser-ticket-modal-section">
                <h3>Ticket Details</h3>

                <div className="ticket-mainuser-ticket-modal-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                  />
                </div>

                <div className="ticket-mainuser-ticket-modal-group">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    rows="5"
                    placeholder="Describe the issue in detail.."
                    rows={6}
                    maxLength={2000}
                  />

                  {/*     <div className="ticket-description-counter">
                    {description.length}/2000
                  </div> */}
                </div>

                <div className="ticket-mainuser-ticket-modal-group">
                  <label>Attachment</label>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editPreviewUrl && (
                    <div className="ticket-mainuser-ticket-modal-gallery">
                      <img src={editPreviewUrl} alt={"Preview"} />
                    </div>
                  )}
                </div>
              </div>

              <div className="ticket-mainuser-ticket-modal-buttons">
                <button
                  type="submit"
                  className="ticket-mainuser-ticket-modal-submitbtn"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ticket-mainuser-ticket-modal-clearbtn"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TICKET */}
      {showEditTicket && (
        <div className="ticket-mainuser-edit-overlay">
          <div className="ticket-mainuser-edit-modal">
            <div className="ticket-mainuser-edit-modal-header">
              <h2>Edit Ticket {` (${selectedTicketNum}) `}</h2>
              <button
                className="ticket-mainuser-edit-modal-closebtn"
                onClick={() => {
                  closeEditModal();
                }}
              >
                X
              </button>
            </div>
            <form
              className="ticket-mainuser-edit-modal-form"
              onSubmit={handleEditSubmit}
            >
              <div className="ticket-mainuser-edit-modal-section">
                <h3>Request Information</h3>

                <div className="ticket-mainuser-edit-modal-grid">
                  <div className="ticket-mainuser-edit-modal-group">
                    <label>Date Created</label>
                    <label var={editDateSubmitted}>{editDateSubmitted}</label>
                  </div>

                  <div className="ticket-mainuser-edit-modal-group">
                    <label>User Id</label>
                    <label value={loggedinUserId}>{loggedinUserId}</label>
                  </div>
                </div>
              </div>

              <div className="ticket-mainuser-edit-modal-section">
                <h3>Asset Information</h3>

                <div className="ticket-mainuser-edit-modal-grid">
                  <div className="ticket-mainuser-edit-modal-group">
                    <label>Asset Type</label>

                    <select
                      name=""
                      id=""
                      value={editAsset}
                      onChange={(e) => {
                        setEditAsset(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        --Select--
                      </option>
                      {assetList.map((item) => (
                        <option value={item.asset}> {item.asset}</option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-mainuser-edit-modal-group">
                    <label>FA-Tag</label>
                    <input
                      type="text"
                      value={editFaTag}
                      onChange={(e) => {
                        setEditFaTag(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="ticket-mainuser-edit-modal-section">
                <h3>Ticket Details</h3>

                <div className="ticket-mainuser-edit-modal-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => {
                      setEditSubject(e.target.value);
                    }}
                  />
                </div>

                <div className="ticket-mainuser-edit-modal-group">
                  <label>Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => {
                      setEditDescription(e.target.value);
                    }}
                    rows="5"
                    placeholder="Describe the issue in detail.."
                    rows={6}
                    maxLength={2000}
                  />

                  {/*     <div className="ticket-description-counter">
                    {description.length}/2000
                  </div> */}
                </div>

                <div className="ticket-mainuser-edit-modal-group">
                  <label>Attachment</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editHasAttachment && (
                    <div className="ticket-mainuser-edit-modal-gallery">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/ticketing/user/ticket/getticketimage/${selectedTicketNum}`}
                        alt={editAttachmentFilename}
                        onClick={() => {
                          window.open(
                            `${process.env.REACT_APP_API_URL}/ticketing/user/ticket/getticketimage/${selectedTicketNum}`,
                            "_blank",
                          );
                        }}
                      />
                      <p>{editAttachmentFilename}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="ticket-mainuser-edit-modal-buttons">
                <button
                  type="submit"
                  className="ticket-mainuser-edit-modal-submitbtn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h2 className="ticket-mainuser-ticket-title">Ticket</h2>
      <div className="ticket-mainuser-ticket-wrapper">
        <div className="ticket-mainuser-ticket-headercontainer">
          <div className="ticket-mainuser-ticket-header-group ticket-button">
            <button
              onClick={() => {
                setShowCreateTicket(true);
              }}
            >
              Create Ticket
            </button>
          </div>
          <div className="ticket-mainuser-ticket-header-group">
            <div className="ticket-mainuser-ticket-search-container">
              <label htmlFor="">Search</label>
              <input
                title="Search..."
                value={search}
                type="search"
                placeholder="🔍 Search Ticket #,and Subject..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="ticket-mainuser-ticket-tablewrapper">
          <div className="ticket-mainuser-ticket-tablecontainer">
            <TableVirtuoso
              className="ticket-mainuser-ticket-table-virtuoso"
              data={filteredTickets}
              components={{
                Table: (props) => (
                  <table {...props} className="ticket-mainuser-ticket-table" />
                ),
              }}
              fixedHeaderContent={() => (
                <tr>
                  <th>No.</th>
                  <th>Ticket #</th>
                  <th>Date Created</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>IT In-charge</th>
                  <th>Date Started</th>
                  <th>Date Finished</th>
                  <th>Action</th>
                </tr>
              )}
              itemContent={(index, item) => (
                <>
                  <td>{index + 1}</td>
                  <td>{item.ticket_num_ticket}</td>
                  <td>{item.d_submitted}</td>
                  <td>{item.subject_title}</td>
                  <td>{item.status}</td>
                  <td>{item.staff_name}</td>
                  <td>{item.time_started}</td>
                  <td>{item.time_finished}</td>
                  <td>
                    <div className="ticket-mainuser-ticket-table-actionbtn">
                      <button
                        title="Edit Ticket"
                        className="ticket-mainuser-ticket-table-editbtn"
                        onClick={() => {
                          handleEditButton(item);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="ticket-mainuser-ticket-table-cancelbtn"
                        title="Cancel Ticket"
                        onClick={() => {
                          handleCancelledTicket(item);
                        }}
                      >
                        <MdCancel />
                      </button>
                    </div>
                  </td>
                </>
              )}
            ></TableVirtuoso>
          </div>
        </div>
      </div>
    </div>
  );
}
