import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_ReceiveRis.css";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ppc/ris_index";

export default function RisReceiveRis({ closeReceivePage }) {
  const [risNum, setRisNum] = useState("");
  const [date, setDate] = useState("");
  const [requestor, setRequestor] = useState("");
  const [section, setSection] = useState("");
  const [receiveBy, setReceiveBy] = useState("");
  const [staffs, setStaffs] = useState([]);

  //RIS DATA
  const [risData, setRisData] = useState([]);

  //SELECTED DATA
  const [selectedStaff, setSelectedStaff] = useState("");

  const risNumRef = useRef(null);
  useEffect(() => {
    risNumRef.current.focus();
  }, []);

  //GET WAREHOUSE STAFF
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/ris/management/staffs`)
      .then((res) => res.json())
      .then((data) => {
        setStaffs(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // POPULATE RIS DATA (REALTIME)
  useEffect(() => {
    const fetchRisData = () => {
      fetch(`${process.env.REACT_APP_API_URL}/ris/management/risData`)
        .then((res) => res.json())
        .then((data) => {
          setRisData(data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    // First fetch
    fetchRisData();

    //refresh every 3 seconds
    const interval = setInterval(() => {
      fetchRisData();
    }, 3000);

    //cleanup
    return () => clearInterval(interval);
  }, []);

  // COMPARING THE RISNUM FROM THE QR CODE TO THE POPULATED RISDATA
  useEffect(() => {
    if (!risNum) {
      setDate("");
      setRequestor("");
      setSection("");
      return;
    }

    const foundRis = risData.find(
      (item) =>
        item.risnum?.toLowerCase().trim() === risNum.toLowerCase().trim(),
    );

    if (foundRis) {
      setDate(foundRis.date || "");
      setRequestor(foundRis.requestor || "");
      setSection(foundRis.section || "");
    } else {
      setDate("");
      setRequestor("");
      setSection("");
    }
  }, [risNum, risData]);

  //RECEIVE RIS
  async function handleReceive() {
    try {
      if (!risNum) {
        alert("Please scan the qr code!");
        risNumRef.current.focus();
        return;
      }

      if (!selectedStaff) {
        alert("Select the name of the staff who will receive this RIS");
        return;
      }

      if (!requestor) {
        alert("No record found!");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/receive/receiveris`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            risNum: risNum,
            receiveBy: selectedStaff,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        await fetchRisData;
        alert("RIS successfully received");
        risNumRef.current.focus();

        //clear fields
        setRisNum("");
        setDate("");
        setRequestor("");
        setSection("");
        setSelectedStaff("");
      } else {
        alert(data.error || "Failed to receive RIS");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  }

  //REFRESH THE DATA AFTER RECEIVING\

  const fetchRisData = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/management/risData`,
      );
      const data = await res.json();
      setRisData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRisData();
  }, []);

  return (
    <div className="ris-receive-ris-container">
      {/* CLOSE BUTTON */}
      <div className="ris-receive-ris-close-btn" onClick={closeReceivePage}>
        X
      </div>
      <div className="ris-receive-ris-header">
        <h2>Scan the QR Code on the RIS to get the details</h2>
      </div>
      <div className="ris-receive-ris-form">
        <div className="ris-receive-ris-group">
          <label>Requisition Number</label>
          <input
            type="text"
            className="ris-receive-ris-risnum"
            ref={risNumRef}
            placeholder="RIS Number"
            value={risNum}
            onChange={(e) => {
              setRisNum(e.target.value);
            }}
          />
        </div>
        <div className="ris-receive-ris-group">
          <label>Date</label>
          <label className="ris-receive-ris-label ris-receive-ris-date">
            {date || "-"}
          </label>
        </div>
        <div className="ris-receive-ris-group">
          <label>Requestor</label>
          <label className="ris-receive-ris-label ris-receive-ris-requestor">
            {requestor || "-"}
          </label>
        </div>
        <div className="ris-receive-ris-group">
          <label>Section</label>
          <label className="ris-receive-ris-label ris-receive-ris-section">
            {section || "-"}
          </label>
        </div>
        <div className="ris-receive-ris-group">
          <label>Receive By</label>
          <select
            className="ris-receive-ris-staff"
            value={selectedStaff}
            onChange={(e) => {
              setSelectedStaff(e.target.value);
            }}
          >
            <option value="" disabled>
              -- Select Staff --
            </option>
            {staffs.map((item, index) => (
              <option key={item.index} value={item.staff}>
                {item.staff}
              </option>
            ))}
          </select>
        </div>
        <button
          className="ris-receive-ris-receivebtn"
          onClick={() => {
            handleReceive();
          }}
        >
          <img src={RIS_IMAGE.all_receive_btn} alt="Receive Button" />
          Receive
        </button>
      </div>
    </div>
  );
}
