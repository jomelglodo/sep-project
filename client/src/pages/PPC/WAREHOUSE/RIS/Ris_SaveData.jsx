import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_SaveData.css";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ppc/ris_index";

export default function SaveData({ closeSaveData, successSaved }) {
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const passwordRef = useRef(null);
  const cancelBtnRef = useRef(null);

  //disable Confirm button when generating excel to avoid the user to click confirm multiple times
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  // USEEFFECT
  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (showConfirmMessage && cancelBtnRef.current) {
      setTimeout(() => {
        cancelBtnRef.current.focus();
      }, 0);
    }
  }, [showConfirmMessage]);

  //GET ALL STAFF

  useEffect(() => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/ris/management/staffs`)
        .then((res) => res.json())
        .then((data) => {
          setStaffs(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  //SAVE DATA----------------------------------------------------------------------------
  function checkRisData() {
    try {
      return fetch(
        `${process.env.REACT_APP_API_URL}/ris/management/checkAllRis`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.dataAffected > 0) {
            alert("Please receive all RIS before saving");
            return false;
          }
          return true;
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }

  //CONFIRMATION MESSAGEBOX
  async function confirmForm() {
    try {
      //avoid the user to click multiple times
      if (isGeneratingRef.current) return;

      isGeneratingRef.current = true;
      setIsGenerating(true);

      //check if all RIS was received
      const isValid = await checkRisData();

      const year = String(new Date().getFullYear());
      const month = new Date().toLocaleString("default", {
        month: "long",
      });

      if (!isValid) return;

      //download the excel file using fetch (two types)
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/ris/management/saveWorkbook`,
        {
          savedby: selectedStaff,
        },
        {
          responseType: "blob", // VERY IMPORTANT
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `RIS ${month} ${year}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setShowConfirmMessage(false);

      successSaved();
      closeSaveData();
    } catch (err) {
      console.error(err.message);
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  }

  //HANDLE SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedStaff) {
      alert("Please select a staff");
      return;
    }

    if (!enteredPassword) {
      alert("Please enter the password");
      passwordRef.current.focus();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/management/cutOffPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            saveDataPassword: enteredPassword,
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        // alert(
        //   "All RIS data are now save in a wokbook, Please check the download folder",
        // );
        //add await to make the update finish first before closing the modal
        setShowConfirmMessage(true);
      } else {
        setErrorMessage("Password is incorrect");
        setShowErrorMessage(true);
        setTimeout(() => {
          setErrorMessage("");
          setShowErrorMessage(false);
        }, 2000);
        passwordRef.current.focus();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="ris-savedata-container">
      {showConfirmMessage && (
        <div className="ris-savedata-confirm-overlay">
          <div className="ris-savedata-confirm-modal">
            <h3>Confirmation</h3>
            <p>
              All data in the database will be erased after the data has been
              successfully saved to the database
            </p>
            <p>Are you sure you want to save all RIS data?</p>

            <div className="ris-savedata-confirm-btn-container">
              <button
                type="button"
                disabled={isGenerating}
                onClick={confirmForm}
              >
                {isGenerating ? "Generating..." : "Confirm"}
              </button>
              <button
                ref={cancelBtnRef}
                onClick={() => {
                  if (passwordRef.current) {
                    passwordRef.current.focus();
                  }
                  setShowConfirmMessage(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="ris-savedata-close-btn" onClick={closeSaveData}>
        X
      </div>
      <div className="ris-savedata-header">
        <h2>Save Data</h2>
        <p>Please enter the administrator password to save the file</p>
      </div>
      <form className="ris-savedata-form" onSubmit={handleSubmit}>
        <div className="ris-savedata-group-container">
          <div className="ris-savedata-group">
            <label htmlFor="">Saved By: </label>
            <select
              required
              value={selectedStaff}
              onChange={(e) => {
                setSelectedStaff(e.target.value);
              }}
            >
              <option value="" disabled>
                {" "}
                -- Select --{" "}
              </option>
              {staffs.map((item, index) => (
                <option key={index} value={item.staff}>
                  {item.staff}
                </option>
              ))}
            </select>
          </div>
          <div className="ris-savedata-group">
            <label htmlFor="">Password :</label>
            <input
              required
              placeholder="Enter the password"
              type="password"
              ref={passwordRef}
              value={enteredPassword}
              onChange={(e) => {
                setEnteredPassword(e.target.value);
              }}
            />
          </div>
        </div>
        {/* SHOW ERROR MESSAGE */}
        {showErrorMessage && (
          <div className="ris-savedata-errormessage">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="ris-savedata-submit-btn-container">
          <button type="submit" className="ris-savedata-submit-btn">
            <img src={RIS_IMAGE.all_submit} alt="Submit Button" />
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
