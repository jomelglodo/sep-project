import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_SetCutOff.css";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ris_index";

export default function SetCutOff({ closeSetCutOff }) {
  const [password, setPassword] = useState("");
  const [cutOffStatus, setCutOffStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState("");

  const passwordRef = useRef(null);
  const cancelBtnRef = useRef(null);

  //USEEFFECTS SECTION----------------------------------------------
  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [showConfirm]);

  //GET THE RIS CUT OFF STATUS
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/ris/management/cutOffStatus`)
      .then((res) => res.json())
      .then((data) => {
        setCutOffStatus(data.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [cutOffStatus]);

  //FUNCTION SECTIONS--------------------------------------------------------------

  //UPDATE THE CUT OFF STATUS USING .then
  async function updateCutOffStatus() {}

  //SHOW CONFIRM MESSAGE
  async function confirmMessage() {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/ris/management/updateRisStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: cutOffStatus,
        }),
      },
    );

    const data = await response.json();
    if (data.succes) {
      alert(`Cut off status is now set to ${data.newStatus}`);
      setShowConfirm(false);
      closeSetCutOff();
    }
    /* return data.newStatus; */
  }
  //HANDLE SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();

    if (!password) {
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
            cutOffPassword: password,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setShowConfirm(true);
        // const updatedStatus = await updateCutOffStatus();
        // closeSetCutOff();
        // alert(`Cut off status is now set to ${updatedStatus}`);
      } else {
        alert("Wrong Password");
        passwordRef.current.focus();
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="ris-setcutoff-container">
      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="ris-setcutoff-confirm-overlay">
          <div className="ris-setcutoff-confirm-modal">
            <h3>Confirmation</h3>
            <p>Are you sure you want to save the changes?</p>

            <div className="ris-setcutoff-confirm-btn-container">
              <button type="button" onClick={confirmMessage}>
                Confirm
              </button>
              <button
                type="button"
                ref={cancelBtnRef}
                onClick={() => {
                  if (passwordRef.current) {
                    passwordRef.current.focus();
                  }

                  setShowConfirm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button className="ris-setcutoff-close-btn" onClick={closeSetCutOff}>
        X
      </button>
      <div className="ris-setcutoff-header">
        <h2>Set cut-off RIS</h2>
        <p>Please enter the administrator password</p>
      </div>

      <form className="ris-setcutoff-form" onSubmit={handleSubmit}>
        <div className="ris-setcutoff-group">
          <label htmlFor="">Password : </label>
          <input
            type="password"
            placeholder="Enter Password"
            ref={passwordRef}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {/*  DISPLAY THE RIS CUT OFF Status */}
        <div className="ris-setcutoff-group">
          <label>Cut Off Status :</label>
          <label className="ris-setcutoff-status">{cutOffStatus}</label>
        </div>
        <div className="ris-setcutoff-btn-container">
          <button type="submit">
            <img src={RIS_IMAGE.all_submit} alt="Submit Button" />
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
