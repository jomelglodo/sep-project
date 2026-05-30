import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/RIS/Ris_VoidRis.css";

//import all images inside the src folder
import { RIS_IMAGE } from "../../../../assets/images/ris_index";

export default function VoidRis({ closeVoidRis }) {
  const [password, setPassword] = useState("");
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const passwordRef = useRef(null);
  const cancelBtnRef = useRef(null);

  //USEEFFECT
  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);

  useEffect(() => {
    //if cancel button exist
    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [showConfirmMessage]);

  //FUNCTION

  //UPDATE ALL RIS TO VOID
  async function voidAllRis() {}

  //CONFIRMATION MESSAGEBOX
  async function confirmForm() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/management/voidAllRis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      if (data.success) {
        alert("All unreceived RIS`s are now set to void");
        setShowConfirmMessage(false);
        closeVoidRis();
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  //HANDLE SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();

    if (!password) {
      alert("Please enter the password");
      passwordRef.current.focus();
      return;
    }

    //user confirmation
    /*  const confirmVoid = window.confirm(
      "Are you sure you want to void all unreceived RIS?",
    );

    if (!confirmVoid) {
      return;
    } */

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ris/management/cutOffPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voidPassword: password,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        //alert("All unreceived RIS`s are now set to void");
        //add await to make the update finish first before closing the modal
        setShowConfirmMessage(true);
      } else {
        alert("password is incorrect");
        passwordRef.current.focus();
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="ris-void-container">
      {/* CONFIRM MODAL */}
      {showConfirmMessage && (
        <div className="ris-void-confirm-overlay">
          <div className={`ris-void-confirm-modal`}>
            <h3>Confirmation</h3>
            <p>Are you sure you want to void all unreceived RIS?</p>

            <div className="ris-void-confirm-btn-container">
              <button type="button" onClick={confirmForm}>
                Confirm
              </button>
              <button
                type="button"
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
      {/* CLOSE BUTTON */}
      <button className="ris-void-close-btn" onClick={closeVoidRis}>
        X
      </button>
      <div className="ris-void-header">
        <h2>Void all blank RIS</h2>
        <p>Please enter the administrator password</p>
      </div>
      <form className="ris-void-form" onSubmit={handleSubmit}>
        <div className="ris-void-group">
          <label>Password :</label>
          <input
            type="password"
            placeholder="Enter the password"
            ref={passwordRef}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="ris-void-submit-btn-container">
          <button type="submit" className="ris-void-submit-btn">
            <img src={RIS_IMAGE.all_submit} alt="Submit Button" />
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
