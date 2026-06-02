import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris.css";
import RisLogin from "./Ris_Login";
import RISManagement from "./Ris_Management";
//use to create ris
//import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ris_index";

export default function RIS() {
  const [showCurtain, setShowCurtain] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [requestor, setRequestor] = useState("");
  const [risQty, setRisQty] = useState(1);
  const selectedRef = useRef(null);
  //let currentDate = new Date().toISOString().split("T")[0];
  const [currentDate, setCurrentDate] = useState("");
  //const toFormatDate = new Date();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [showSuccessDownloaded, setShowSuccessDownloaded] = useState(false);
  const [isCutOff, setIsCutOff] = useState(false);

  const cancelBtnRef = useRef(null);

  /* LOGINFORM STATE */

  const [showLogin, setShowLogin] = useState(false);

  //disable Confirm button when generating excel to avoid the user to click confirm multiple times
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  //split the date and then format it to (e.g: 26/05/19)
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

  //to close the LOGIN form when the user click the escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setShowLogin(false);
      }
    }
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  //get the cutoff status
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
  //USE POLLING TO DETECT EVERY 3 SECOND IF THE CUT OFF STATUS IS CHANGE
  useEffect(() => {
    fetchCutOffStatus();

    const interval = setInterval(() => {
      fetchCutOffStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchCutOffStatus();
  }, [isCutOff]);

  async function confirmForm() {
    try {
      //avoid the use to click multiple times
      if (isGeneratingRef.current) return;
      isGeneratingRef.current = true;
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
      /* CLOSE SUCCESS MESSAGE AFTER 2 SECONDS */
      setTimeout(() => {
        setShowSuccessDownloaded(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Error in generating RIS");
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  }

  async function handleRequest() {
    if (!selectedSection || !requestor) {
      alert("Please complete all fields");
      return;
    }

    setShowConfirmMessage(true);
  }

  if (isLoggedIn) {
    return <RISManagement closeRisManagement={() => setIsLoggedIn(false)} />;
    /*  return (
      <RISManagement
        className={showCurtain ? "curtain-open" : ""}
        closeRisManagement={() => setIsLoggedIn(false)}
      />
    ); */
  }

  return (
    <div className="ris-page">
      {/* SHOW SUCESS MESSAGE */}
      {showSuccessDownloaded && (
        <div className="ris-success-overlay">
          <div className="ris-success-modal">
            <button
              className="ris-success-close-btn"
              onClick={() => {
                setShowSuccessDownloaded(false);
              }}
            >
              X
            </button>
            <div className="ris-success-image-container">
              <img src={RIS_IMAGE.home_success} alt="" />
            </div>
            <div className="ris-success-message">
              <p>File Successfully downloaded</p>
            </div>
          </div>
        </div>
      )}
      {/* LOGIN MODAL */}
      {showLogin && (
        <div
          className="ris-login-overlay"
          //tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowLogin(false);
            }
          }}
        >
          <div className="ris-login-modal" onClick={(e) => e.stopPropagation()}>
            <RisLogin
              closeLogin={() => setShowLogin(false)}
              onSuccess={() => {
                setShowLogin(false);
                setShowCurtain(true);
                setIsLoggedIn(true);
                /* setTimeout(() => {
                 
                }, 5000); */
              }}
            />
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirmMessage && (
        <div className="ris-confirm-overlay">
          <div className={`ris-confirm-modal`}>
            <h3>Confirmation</h3>
            <p>Are you sure you want to create the RIS?</p>

            <div className="ris-confirm-btn-container">
              <button
                type="button"
                disabled={isGenerating}
                onClick={confirmForm}
              >
                {isGenerating ? "Generating" : "Confirm"}
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

      {/* RIS CARD */}

      <div className={`ris-card ${showLogin ? "ris-login-disabled" : ""}`}>
        <div className="ris-header">
          <div className="ris-header-content">
            <h2>Request RIS</h2>
            <p>Please fill out the required field</p>
          </div>
          <div className="ris-login-btn-container">
            <button
              className="btn-ris-login"
              onClick={() => setShowLogin(true)}
            >
              <img src={RIS_IMAGE.all_login_btn} alt="Log-in Button" />
              LOGIN
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="ris-body">
          <div className="ris-input-group">
            <div className="ris-date-container">
              <label>Date :</label>
              <p className="ris-date"> {currentDate}</p>
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
              className="ris-requestor"
              value={requestor}
              placeholder="Enter the requestor name"
              onChange={(e) => {
                setRequestor(e.target.value);
              }}
            />
            <div className="ris-qty-container">
              <label>Select the number of RIS</label>
              <div className="ris-qty-group">
                {[1, 2, 3, 4, 5].map((qty) => (
                  <label key={qty} className="ris-radio-label">
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
            <div className="ris-cutoff-status">
              <p>Requesting RIS is now cut-off</p>
            </div>
          ) : (
            <button className="btn-request" onClick={handleRequest}>
              <img src={RIS_IMAGE.all_create_btn} alt="Create Button" />
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
