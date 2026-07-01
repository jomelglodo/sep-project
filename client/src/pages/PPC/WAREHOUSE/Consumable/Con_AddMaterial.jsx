import React, { useState, useRef, useEffect } from "react";
import "../../../../assets/styles/PPC/WAREHOUSE/Consumable/Con_AddMaterial.css";

//IMPORT IMAGES
import { CON_IMAGE } from "../../../../assets/images/ppc/consumable_index";

export default function AddMaterial({ closeAddMaterial }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  //DATA STORAGE
  const [itemCode, setItemCode] = useState("");
  const [suppName, setSuppname] = useState("");
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [uom, setUom] = useState("");
  const [conQty, setConQty] = useState("");
  const [conUnit, setConUnit] = useState("");

  //GET ALL CATEGORY
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/con/category`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //CLEAR DATA
  function clearData() {
    setItemCode("");
    setSuppname("");
    setCategory("");
    setItemName("");
    setUom("");
    setConQty("");
    setConUnit("");
  }

  async function handleConfirm() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/con/insertmaterial`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemCode,
            suppName,
            category,
            itemName,
            uom,
            conQty,
            conUnit,
          }),
        },
      );

      const data = await response.json();

      //CLEAR DATA

      if (data.success) {
        clearData();

        setShowConfirm(false);
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
        }, 2000);
        return;
      }

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function handleAddMaterial(e) {
    e.preventDefault();

    setShowConfirm(true);
  }
  return (
    <div className="con-addmaterial-container">
      {/* SHOW CONFIRM MODAL */}
      {showConfirm && (
        <div className="con-addmaterial-confirm-overlay">
          <div className="con-addmaterial-confirm-modal">
            <h2>Confirmation</h2>
            <p>Are you sure to add this material?</p>
            <div className="con-addmaterial-confirm-button-container">
              <button onClick={handleConfirm} type="submit">
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="con-addmaterial-form" onSubmit={handleAddMaterial}>
        <h2>ADD MATERIAL</h2>
        <div className="con-addmaterial-group">
          <label>Item Code :</label>
          <input
            type="text"
            required
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          />
        </div>
        <div className="con-addmaterial-group">
          <label>Supplier Name :</label>
          <input
            type="text"
            required
            value={suppName}
            onChange={(e) => setSuppname(e.target.value)}
          />
        </div>
        <div className="con-addmaterial-group">
          <label>Category :</label>
          <select
            name=""
            id=""
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              --Select--
            </option>
            {categoryList.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
        </div>
        <div className="con-addmaterial-group">
          <label>Item Name :</label>
          <input
            type="text"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="con-addmaterial-group">
          <label>UOM :</label>
          <input
            type="text"
            required
            value={uom}
            onChange={(e) => setUom(e.target.value)}
          />
        </div>
        <div className="con-addmaterial-group">
          <label>Convertion Qty. :</label>
          <input
            type="text"
            required
            value={conQty}
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) => setConQty(e.target.value)}
          />
        </div>
        <div className="con-addmaterial-group">
          <label>Convertion Unit :</label>
          <input
            type="text"
            required
            value={conUnit}
            onChange={(e) => setConUnit(e.target.value)}
          />
        </div>
        {successMessage && (
          <div className="con-addmaterial-success-container">
            <p>Successfully added</p>
          </div>
        )}
        <div className="con-addmaterial-button-container">
          <button type="submit">
            <img src={CON_IMAGE.main_addmaterialbtn} alt="Add Button" />
            Add
          </button>
          <button onClick={closeAddMaterial} type="button">
            <img src={CON_IMAGE.main_addmaterial_closebtn} alt="Close Button" />
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
