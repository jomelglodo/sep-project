import React, { useEffect, useState } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_Management.css";
import SetCutOff from "./Ris_SetCutOff";
import RisReceiveRis from "./Ris_ReceiveRis";
import VoidRis from "./Ris_VoidRis";
import ShowOngoingRis from "./Ris_OngoingRis";
import CreateRis from "./Ris_CreateRis";
import SaveData from "./Ris_SaveData";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ris_index";

export default function RISManagement({ closeRisManagement, className }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const currentDate = new Date().toISOString().split("T")[0];

  //populating data

  const [sections, setSections] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [risData, setRisData] = useState([]);

  //show headers button content\
  const [showCreateRis, setShowCreateRis] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showCutOff, setShowCutOff] = useState(false);
  const [showVoidAllBlank, setShowVoidAllBlank] = useState(false);
  const [showOngoingRis, setShowOngoingRis] = useState(false);
  const [showReceivedRis, setShowReceivedRis] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  //confirm message

  const [showSuccessDownloaded, setShowSuccessDownloaded] = useState(false);

  //GET SECTIONS
  /*   useEffect(() => {
    fetch("http://localhost:5000/ris/management/sections")
      .then((res) => res.json())
      .then((data) => {
        setSections(data);
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(sections);
  }, []);
 */
  //GET STAFF
  /*   useEffect(() => {
    fetch("http://localhost:5000/ris/management/staffs")
      .then((res) => res.json())
      .then((data) => {
        setStaffs(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); */

  //POPULATE RIS DATA (REALTIME)
  useEffect(() => {
    const fetchRisData = () => {
      fetch(`${process.env.REACT_APP_API_URL}/ris/management/risData`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((item) => ({
            risnum: item.risnum,
            date: item.date,
            requestor: item.requestor,
            section: item.section,
            receivedby: item.receivedby,
            status: item.receivedby ? "Received" : "Ongoing",
          }));
          setRisData(formatted);
        })
        .catch((err) => console.error(err));
    };

    fetchRisData();

    //refresh every 3seconds

    const interval = setInterval(() => {
      fetchRisData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  //data counter

  const totalCount = risData.length;
  //const filteredCount = filteredData.length;

  const filteredData = risData.filter((item) => {
    const matchSearch =
      item.risnum?.toLowerCase().includes(search.toLowerCase()) ||
      item.requestor?.toLowerCase().includes(search.toLowerCase()) ||
      item.section?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleSuccessSaved = () => {
    setShowSuccessDownloaded(true);

    setTimeout(() => {
      setShowSuccessDownloaded(false);
    }, 3000);
  };

  return (
    <div className={`ris-mgmt-page ${className || ""}`}>
      {/* <div className="ris-mgmt-header">
        <h1>RIS Management Dashboard</h1>
        <p>Manage and track all RIS requests</p>
      </div> */}

      {/* SUCCESS MESSAGE */}
      {showSuccessDownloaded && (
        <div className="ris-mgmt-success-overlay">
          <div className="ris-mgmt-success-modal">
            <button
              className="ris-mgmt-success-close-btn"
              onClick={() => {
                setShowSuccessDownloaded(false);
              }}
            >
              X
            </button>
            <div className="ris-mgmt-success-image-container">
              <img src={RIS_IMAGE.home_success} alt="" />
            </div>
            <div className="ris-mgmt-success-message">
              <p>File Successfully downloaded</p>
            </div>
          </div>
        </div>
      )}
      {/* MODALS */}
      {activeModal && (
        <div
          className="ris-mgmt-page-overlay"
          onClick={() => {
            if (
              activeModal === "setcutoff" ||
              activeModal === "voidris" ||
              activeModal === "showongoing"
            ) {
              setActiveModal("");
            }
          }}
        >
          <div
            className="ris-mgmt-page-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {activeModal === "receiveris" && (
              <RisReceiveRis
                closeReceivePage={() => {
                  setActiveModal("");
                }}
              />
            )}
            {activeModal === "setcutoff" && (
              <SetCutOff
                closeSetCutOff={() => {
                  setActiveModal("");
                }}
              />
            )}
            {activeModal === "voidris" && (
              <VoidRis
                closeVoidRis={() => {
                  setActiveModal("");
                }}
              />
            )}
            {activeModal === "showongoing" && (
              <ShowOngoingRis
                closeOngoingRis={() => {
                  setActiveModal("");
                }}
              />
            )}
            {activeModal === "createris" && (
              <CreateRis
                closeRis={() => {
                  setActiveModal("");
                }}
              />
            )}
            {activeModal === "savedata" && (
              <SaveData
                closeSaveData={() => {
                  setActiveModal("");
                }}
                successSaved={() => {
                  handleSuccessSaved();
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* HEADERS BUTTON */}
      <div className="ris-mgmt-headers-btn">
        <div className="ris-mgmt-headers-normal-btn">
          <button
            className="btn-mgmt-createris"
            onClick={() => {
              setActiveModal("createris");
            }}
          >
            <img src={RIS_IMAGE.main_create} alt="Create RIS" />
            Create RIS
          </button>
          <button
            className="btn-mgmt-receive"
            onClick={() => {
              setActiveModal("receiveris");
            }}
          >
            <img src={RIS_IMAGE.main_receive} alt="Receive RIS" />
            Receive
          </button>
        </div>

        <div className="ris-mgmt-headers-critical-btn">
          <button
            className="btn-mgmt-setcutoff btn-mgmt-secondary"
            onClick={() => {
              setActiveModal("setcutoff");
            }}
          >
            <img src={RIS_IMAGE.main_cutoff} alt="Set Cut-off RIS" />
            Set Cut Off in RIS
          </button>
          <button
            className="btn-mgmt-void btn-mgmt-secondary"
            onClick={() => {
              setActiveModal("voidris");
            }}
          >
            <img src={RIS_IMAGE.main_void} alt="Void All RIS" />
            Void All Blank
          </button>
          <button
            className="btn-mgmt-showongoing btn-mgmt-secondary"
            onClick={() => {
              setActiveModal("showongoing");
            }}
          >
            <img src={RIS_IMAGE.main_ongoing} alt="Show Ongoing RIS" />
            Show Ongoing RIS
          </button>
          <button
            className="btn-mgmt-savedata btn-mgmt-secondary"
            onClick={() => {
              setActiveModal("savedata");
            }}
          >
            <img src={RIS_IMAGE.main_save} alt="Save Data" />
            Save Data
          </button>
        </div>
        <div className="ris-mgmt-logout-btn-container">
          <button className="ris-mgmt-logout-btn" onClick={closeRisManagement}>
            <img src={RIS_IMAGE.main_logout} alt="Logout" />
            Log out
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="ris-mgmt-filter-container">
        <div className="ris-mgmt-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="🔎 Search by RIS #,Requestor,Section..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/*         <div className="ris-mgmt-filter-group">
          <label>Date</label>
          <input type="date" defaultValue={currentDate} />
        </div> */}
        {/*   <div className="ris-mgmt-filter-group">
          <label htmlFor="">Section</label>
          <select
            value={selectedSection}
            className="ris-mgmt-selectedsection"
            onChange={(e) => {
              setSelectedSection(e.target.value);
            }}
          >
            <option value="" disabled>
              -- Select section --
            </option>

            {sections.map((item, index) => (
              <option key={index} value={item.section}>
                {item.section}
              </option>
            ))}
          </select>
        </div> */}
        {/* <div className="ris-mgmt-filter-group">
          <label htmlFor="">Received By</label>
          <select
            value={selectedStaff}
            className="ris-mgmt-selectedstaff"
            onChange={(e) => {
              setSelectedStaff(e.target.value);
            }}
          >
            <option value="" disabled>
              -- Select Receiver --
            </option>
            {staffs.map((item, index) => (
              <option key={index} value={item.staff}>
                {item.staff}
              </option>
            ))}
          </select>
        </div> */}
        <div className="ris-mgmt-filter-group">
          <label htmlFor="">Status</label>
          <div className="ris-mgmt-status-btn">
            <button
              className={statusFilter === "All" ? "btnactive" : ""}
              onClick={() => {
                setStatusFilter("All");
              }}
            >
              All
            </button>
            <button
              className={
                statusFilter === "Ongoing"
                  ? "btn-ris-mgmt-ongoing btnactive"
                  : "btn-ris-mgmt-ongoing"
              }
              onClick={() => {
                setStatusFilter("Ongoing");
              }}
            >
              Ongoing
            </button>
            <button
              className={
                statusFilter === "Received"
                  ? "btn-ris-mgmt-received btnactive"
                  : "btn-ris-mgmt-received"
              }
              onClick={() => {
                setStatusFilter("Received");
              }}
            >
              Received
            </button>
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="ris-mgmt-table-wrapper">
        <div className="ris-mgmt-table-container">
          <table className="ris-mgmt-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>RIS Number</th>
                <th>Date</th>
                <th>Requestor</th>
                <th>Section</th>
                <th>Received By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.risnum}</td>
                  <td>{item.date}</td>
                  <td>{item.requestor}</td>
                  <td>{item.section}</td>
                  <td>{item.receivedby}</td>
                  <td>
                    <span
                      className={`ris-mgmt-status-badge ${item.status === "Received" ? "received" : "ongoing"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* FOOTER */}
      <div className="ris-mgmt-table-footer">
        <p>Total Records {filteredData.length}</p>
      </div>
    </div>
  );
}
