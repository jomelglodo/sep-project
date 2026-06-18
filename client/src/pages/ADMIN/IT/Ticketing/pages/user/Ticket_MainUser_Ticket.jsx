import React from "react";
import { TableVirtuoso } from "react-virtuoso";
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import "../../styles/user/Ticket_MainUser_Ticket.css";

export default function MainUserTicket() {
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
  return (
    <div className="ticket-mainuser-ticket-container">
      <h2>Ticket</h2>
      <div className="ticket-mainuser-ticket-wrapper">
        <div className="ticket-mainuser-ticket-headercontainer">
          <button>Create Ticket</button>
        </div>

        {/* TABLE */}
        <div className="ticket-mainuser-ticket-tablewrapper">
          <div className="ticket-mainuser-ticket-tablecontainer">
            <TableVirtuoso
              className="ticket-mainuser-ticket-table-virtuoso"
              data={sampData}
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
                  <td>{item.ticketnum}</td>
                  <td>{item.datereceived}</td>
                  <td>{item.subject}</td>
                  <td>{item.status}</td>
                  <td>{item.incharge}</td>
                  <td>{item.datestart}</td>
                  <td>{item.datefinish}</td>
                  <td>
                    <div className="ticket-mainuser-ticket-table-actionbtn">
                      <button className="ticket-mainuser-ticket-table-editbtn">
                        <FaEdit />
                      </button>
                      <button className="ticket-mainuser-ticket-table-cancelbtn">
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
