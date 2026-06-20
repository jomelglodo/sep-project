import React, { useEffect, useRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import "../../styles/user/Ticket_MainUser_Ticket.css";

export default function MainUserTicket({ displayName, loggedinUserId }) {
  const [selectedTicketNum, setSelectedTicketNum] = useState("");
  const [search, setSearch] = useState("");
  //list variables
  const [assetList, setAssetList] = useState([]);
  const [ticketList, setTicketList] = useState([]);

  //DATA STORAGE
  const [curDate, setCurDate] = useState("");
  const [asset, setAsset] = useState("");
  const [faTag, setFaTag] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();

  //MODAL
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  //USEREF
  const fileInputRef = useRef(null);

  const sampData = [
    {
      ticketnum: "#00001",
      datereceived: "2026-04-22 02:01:12PM",
      subject: "Sample",
      status: "Open",
      incharge: "IT-Jomel",
      datestart: "2026-04-22 02:10:12PM",
      datefinish: "2026-04-22 02:31:12PM",
    },
    {
      ticketnum: "#00002",
      datereceived: "2026-04-22 02:01:12PM",
      subject: "Sample 2",
      status: "In Progress",
      incharge: "IT-Jomel",
      datestart: "2026-04-22 02:10:12PM",
      datefinish: "2026-04-22 02:31:12PM",
    },
    {
      ticketnum: "#00003",
      datereceived: "2026-04-22 02:01:12PM",
      subject: "Sample 3",
      status: "Closed",
      incharge: "IT-Jomel",
      datestart: "2026-04-22 02:10:12PM",
      datefinish: "2026-04-22 02:31:12PM",
    },
  ];

  //populate tickets using poll and runs only when the user view Ticket Page
  useEffect(() => {
    let interval;

    const fetchIfVisible = async () => {
      if (document.visibilityState === "visible") {
        await fetchTickets;
      }
    };
    //initial load if visible
    fetchTickets();
    interval = setInterval(() => {
      fetchIfVisible;
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const result = await fetch(`
    ${process.env.REACT_APP_API_URL}/ticketing/user/ticket/gettickets
    `);

      const data = await result.json();
      setTicketList(data);
    } catch (err) {
      console.error(err);
    }
  };

  //reset form and populate assets
  useEffect(() => {
    if (showCreateTicket) {
      resetForm();
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

  function handleEditButton(item) {
    setSelectedTicketNum(item.ticketnum);
  }

  function handleFileChange(e) {
    //for single image attachment
    const file = e.target.files[0];

    if (!file) return;

    setAttachment(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);

    //multiple attachment
    // const files = Array.from(e.target.files);

    // setAttachment(files);

    // const previews = files.map((files) => URL.createObjectURL(files));

    // setPreviewUrl(previews);
  }

  function closeModal() {
    resetForm();
    setShowCreateTicket(false);
  }

  function resetForm() {
    setCurDate("");
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
        alert("Ticket Created");
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
      {showCreateTicket && (
        <div className="ticket-mainuser-ticket-overlay">
          <div className="ticket-mainuser-ticket-modal">
            <div className="ticket-mainuser-ticket-modal-header">
              <h2>Create Ticket</h2>
              <button
                className="ticket-mainuser-ticket-modal-closebtn"
                onClick={() => {
                  setShowCreateTicket(false);
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
                    <label var={curDate}>2026-04-28 13:15:54.062427</label>
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
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl && (
                    <div className="ticket-mainuser-ticket-modal-gallery">
                      <img src={previewUrl} alt={"Preview"} />
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
                  <td>{item.date_submitted}</td>
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
                        onClick={() => {}}
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
