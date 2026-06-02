import React, { useState, useEffect, useRef } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_CreateRis.css";
//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ris_index";

export default function CreateRis({ closeRis }) {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [requestor, setRequestor] = useState("");
  const [risQty, setRisQty] = useState(1);
  //let currentDate = new Date().toISOString().split("T")[0];
  //const toFormatDate = new Date();
  const [currentDate, setCurrentDate] = useState("");
  const selectedRef = useRef(null);
  const cancelBtnRef = useRef(null);

  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [showSuccessDownloaded, setShowSuccessDownloaded] = useState(false);
  const [isCutOff, setIsCutOff] = useState(true);

  //disable Confirm button when generating excel to avoid the user to click confirm multiple times
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  function getCurrentDate() {
    const now = new Date();

    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  function getFormattedDate() {
    const now = new Date();

    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  useEffect(() => {
    setCurrentDate(getCurrentDate());

    //update everyminute
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 50000);
    return () => clearInterval(interval);
  });

  //USEEFFECT
  useEffect(() => {
    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [showConfirmMessage]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/ris/sections`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  async function fetchCutOffStatus() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/cutoffstatus`,
      );
      const data = await res.json();

      if (data === "TRUE") {
        setIsCutOff(true);
      } else {
        setIsCutOff(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  //RUN FETCH STATUS WHEN THE COMPONENT LOADS
  useEffect(() => {
    fetchCutOffStatus();

    const interval = setInterval(() => {
      fetchCutOffStatus();
    }, 2000);

    return () => clearInterval(interval);
  });

  // run fetchCutOffStatus every changes of the data
  useEffect(() => {
    fetchCutOffStatus();
  }, [isCutOff]);
  //to close the LOGIN form when the user click the escape
  /*   useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setShowLogin(false);
      }
    }
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []); */

  async function handleRequest() {
    if (!selectedSection || !requestor) {
      alert("Please complete all fields");
      return;
    }

    setShowConfirmMessage(true);
  }

  async function confirmForm() {
    try {
      //avoid running multiple times when the user click the confirm button multiple times
      if (isGeneratingRef.current) return;

      isGeneratingRef.current = true;
      setIsGenerating(true);

      setIsGenerating(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/generate-ris`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedSection,
            requestor,
            risQty,
            formattedDate: getFormattedDate(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate RIS");
      }

      //get the risnum to the received data
      const risNum_forFileName = response.headers.get("new-risnum");
      //receive excel file

      const blob = await response.blob();

      //download
      const url = window.URL.createObjectURL(blob);

      //auto download workbook
      //saveAs(blob, `RIS_Form_${Date.now()}.xlsx`);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RIS-${risNum_forFileName}.xlsx`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      //clear the fields
      setRequestor("");
      setSelectedSection("");
      setRisQty(1);
      //currentDate = new Date().toISOString().split("T")[0];

      setShowConfirmMessage(false);
      setShowSuccessDownloaded(true);

      setTimeout(() => {
        setShowSuccessDownloaded(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Error in generating RIS");
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false); // unlocks after request finishes
    }
  }

  return (
    <div className="ris-createris-container">
      {/* SHOW SUCESS MESSAGE */}
      {showSuccessDownloaded && (
        <div className="ris-createris-success-overlay">
          <div className="ris-createris-success-modal">
            <button
              className="ris-createris-success-close-btn"
              onClick={() => {
                setShowSuccessDownloaded(false);
              }}
            >
              X
            </button>
            <div className="ris-createris-success-image-container">
              <img src={RIS_IMAGE.home_success} alt="" />
            </div>
            <div className="ris-createris-success-message">
              <p>File Successfully downloaded</p>
            </div>
          </div>
        </div>
      )}
      {/* SHOW CONFIRM MESSAGE */}
      {showConfirmMessage && (
        <div className="ris-createris-confirm-overlay">
          <div className={`ris-createris-confirm-modal`}>
            <h3>Confirmation</h3>
            <p>Are you sure you want to create the RIS?</p>

            <div className="ris-createris-confirm-btn-container">
              <button
                type="button"
                onClick={confirmForm}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Confirm"}
              </button>
              <button
                type="button"
                ref={cancelBtnRef}
                onClick={() => {
                  setShowConfirmMessage(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CLOSE BUTTON */}
      <div className="ris-createris-close-btn" onClick={closeRis}>
        X
      </div>
      {/* HEADER */}
      <div className="ris-createris-header">
        <h2>Request RIS</h2>
        <p className="ris-createris-subtext">
          Please fill out the required field
        </p>
      </div>
      {/* BODY */}
      <div className="ris-createris-body">
        <div className="ris-createris-input-group">
          <div className="ris-createris-date-container">
            <label>Date :</label>
            <p className="ris-createris-date"> {currentDate}</p>
          </div>

          <label>Select Section</label>
          <select
            className="ris-section"
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
            }}
          >
            <option value="" disabled>
              -- Choose --
            </option>
            {sections.map((item, index) => (
              <option key={index} value={item.section}>
                {item.section}
              </option>
            ))}
          </select>
          <label>Requestor Name</label>
          <input
            type="text"
            className="ris-createris-requestor"
            value={requestor}
            placeholder="Enter the requestor name"
            onChange={(e) => {
              setRequestor(e.target.value);
            }}
          />
          <div className="ris-createris-qty-container">
            <label>Select the number of RIS</label>
            <div className="ris-createris-qty-group">
              {[1, 2, 3, 4, 5].map((qty) => (
                <label key={qty} className="ris-createris-radio-label">
                  <input
                    type="radio"
                    name="ris-qty"
                    value={qty}
                    checked={risQty === qty}
                    onChange={() => setRisQty(qty)}
                  />
                  {qty}
                </label>
              ))}
            </div>
          </div>
        </div>
        {isCutOff ? (
          <div className="ris-createris-status">
            <p>Requesting RIS is now cut-off</p>
          </div>
        ) : (
          <button className="btn-createris-create" onClick={handleRequest}>
            <img src={RIS_IMAGE.all_create_btn} alt="Create Button" />
            Create
          </button>
        )}
      </div>
    </div>
  );
}
