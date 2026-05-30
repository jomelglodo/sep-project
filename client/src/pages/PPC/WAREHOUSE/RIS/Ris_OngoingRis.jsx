import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_OngoingRis.css";

export default function ShowOngoingRis({ closeOngoingRis }) {
  const [showSetVoid, setShowSetVoid] = useState(false);
  const [showOngoingRisData, setShowOngoingRisData] = useState([]);
  const [search, setSearch] = useState("");

  const [resultMessage, setResultMessage] = useState("");
  const [selectedRis, setSelectedRis] = useState(null);
  const searchRef = useRef(null);

  /*   const sampleData = [
    {
      risnum: "26050932",
      date: "2026/04/30",
      requestor: "L.Evangelista",
      section: "HFC-2",
    },
    {
      risnum: "26050724",
      date: "2026/05/12",
      requestor: "G.MENDOZA",
      section: "HA",
    },
    {
      risnum: "26050720",
      date: "2026/05/12",
      requestor: "M.Abare",
      section: "HFC-1",
    },
  ]; */

  //USEEFFECT
  useEffect(() => {
    searchRef.current.focus();
  }, []);

  //SHOW ONGOING RIS
  useEffect(() => {
    const fetchOngoingRis = () => {
      fetch(`${process.env.REACT_APP_API_URL}/ris/management/ongoingRis`)
        .then((res) => res.json())
        .then((data) => {
          setShowOngoingRisData(data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchOngoingRis();

    const interval = setInterval(() => {
      fetchOngoingRis();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // HANDLE VOID RIS BUTTON ON MODAL

  async function handleVoidButton() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/management/voidSelectedRis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedRisNum: selectedRis?.risnum,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setResultMessage("Selected RIS successfully set to Void");
        setTimeout(() => {
          setShowSetVoid(false);
          setResultMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  //SEARCH DATA ON THE TABLE

  /*   const filteredData = showOngoingRisData.filter((item) => {
    return item.risnum.toLowerCase().includes(search.toLowerCase());
  }); */
  const filteredData = showOngoingRisData.filter((item) =>
    item.risnum.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ris-ongoingris-container">
      {/* VOID RIS MODAL */}
      {showSetVoid && (
        <div className="ris-ongoingris-setvoid-overlay">
          <div className="ris-ongoingris-setvoid-modal">
            <button
              className="ris-ongoingris-setvoid-close-btn"
              onClick={() => {
                setShowSetVoid(false);
                setResultMessage("");
              }}
            >
              X
            </button>
            <div className="ris-ongoingris-setvoid-header">
              <h2>Selected RIS</h2>
            </div>
            <div className="ris-ongoingris-setvoid-container">
              <div className="ris-ongoingris-setvoid-group">
                <label htmlFor="">RIS Number : </label>
                <label htmlFor="">{selectedRis?.risnum}</label>
              </div>
              <div className="ris-ongoingris-setvoid-group">
                <label htmlFor="">Date :</label>
                <label htmlFor="">{selectedRis?.date}</label>
              </div>
              <div className="ris-ongoingris-setvoid-group">
                <label htmlFor="">Section :</label>
                <label htmlFor="">{selectedRis?.section}</label>
              </div>
              <div className="ris-ongoingris-setvoid-group">
                <label htmlFor="">Requestor :</label>
                <label htmlFor="">{selectedRis?.requestor}</label>
              </div>
              {resultMessage && (
                <p className="ris-ongoingris-resultmessage">{resultMessage}</p>
              )}
              <div className="ris-ongoingris-voidris-container">
                <button
                  className="ris-ongoingris-voidris-btn"
                  onClick={() => {
                    handleVoidButton();
                  }}
                >
                  Void RIS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* CLOSE BUTTON */}
      <div className="ris-ongoingris-close-btn" onClick={closeOngoingRis}>
        X
      </div>
      <div className="ris-ongoing-content-wrapper">
        <div className="ris-ongoingris-header">
          <h2>List of Ongoing RIS</h2>
        </div>
        <div className="ris-ongoingris-search-container">
          <label htmlFor="">Search Ris :</label>
          <input
            type="text"
            placeholder="🔍 Search"
            ref={searchRef}
            className="ris-ongoingris-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        {/*TABLE  */}
        <div className="ris-ongoingris-table-wrapper">
          <div className="ris-ongoingris-table-container">
            <table className="ris-ongoingris-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Requisition No.</th>
                  <th>Date</th>
                  <th>Requestor</th>
                  <th>Section</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setSelectedRis(item);
                      setShowSetVoid(true);
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{item.risnum}</td>
                    <td>{item.date}</td>
                    <td>{item.requestor}</td>
                    <td>{item.section}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="ris-ongoingris-table-footer">
          <p className="">Total Records : {filteredData.length} </p>
        </div>
      </div>
    </div>
  );
}
