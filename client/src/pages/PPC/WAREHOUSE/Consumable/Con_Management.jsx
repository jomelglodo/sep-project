import React, { useState, useRef, useEffect, memo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../../../../assets/styles/PPC/WAREHOUSE/Consumable/Con_Management.css";

import AddMaterial from "./Con_AddMaterial";

//IMPORT IMAGES

import { CON_IMAGE } from "../../../../assets/images/ppc/consumable_index";

export default function ConManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMaterialModal, setShowAddmaterialModal] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");
  const [issueItemModal, setIssueItemModal] = useState(false);
  const [issuanceData, setIssuanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [masterListData, setMasterListData] = useState([]);

  //SEARCH DATE MODAL
  const [showSearchDate, setShowSearchDate] = useState(false);
  const [isDateFilter, setIsDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  //Data container
  const [itemCode, setItemCode] = useState("");

  //CURRENT DATE
  const getLocalDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  //ASSIGN DATE VALUE
  const [receivedDate, setReceivedDate] = useState(getLocalDate);

  const [risNum, setRisNum] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [unit, setUnit] = useState("");
  const [section, setSection] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedQty, setIssuedQty] = useState("");
  const [conQty, setConQty] = useState("");
  const [conUnit, setConUnit] = useState("");
  const [convertedQty, setConvertedQty] = useState("");
  const [category, setCategory] = useState("");

  //SELECTED ITEM
  const [selItemCode, setSelItemCode] = useState("");
  const [selDate, setSelDate] = useState("");
  const [selRisNum, setSelRisNum] = useState("");
  const [selMName, setSelMName] = useState("");
  const [selSupp, setSelSupp] = useState("");
  const [selUnit, setSelUnit] = useState("");
  const [selSection, setSelSection] = useState("");
  const [selIssuedBy, setSelIssuedBy] = useState("");
  const [selIssuedQty, setSelIssuedQty] = useState("");
  const [selConUnit, setSelConUnit] = useState("");
  const [selConQty, setSelConQty] = useState("");
  const [selConvertedQty, setSelConvertedQty] = useState("");

  const [showEditSuccess, setShowEditSuccess] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  //ISSUE ITEM MODAL
  const itemCodeRef = useRef(null);

  useEffect(() => {
    if (issueItemModal) {
      resetForm();
      if (itemCodeRef.current) {
        itemCodeRef.current.focus();
      }
      setReceivedDate(getLocalDate);
    }
  }, [issueItemModal]);

  //refreshkey data
  useEffect(() => {
    fetchIssuanceData();
  }, [refreshKey]);

  //RUN THE DATE EVERY TIME THE ISSUE MODAL IS TRUE
  const resetForm = () => {
    setItemCode("");
    setReceivedDate(getLocalDate);
    setRisNum("");
    setMaterialName("");
    setSupplierName("");
    setUnit("");
    setSection("");
    setIssuedBy("");
    setIssuedQty("");
    setConQty("");
    setConUnit("");
    setConvertedQty("");
    setCategory("");
  };

  //POPULATE SECTION & STAFF NAME
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, staffsRes, masterlistDataRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/con/sections`),
          fetch(`${process.env.REACT_APP_API_URL}/con/staffs`),
          fetch(`${process.env.REACT_APP_API_URL}/con/masterlist`),
        ]);

        const sections = await sectionsRes.json();
        const staffs = await staffsRes.json();
        const masterlist = await masterlistDataRes.json();

        setSectionList(sections);
        setStaffList(staffs);
        setMasterListData(masterlist);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  //SEARCH SELECTED EDIT ITEM TO THE MASTERLIST
  useEffect(() => {
    if (!selItemCode) {
      setSelMName("");
      setSelSupp("");
      setSelUnit("");
      setSelConQty("");
      setSelConUnit("");
      return;
    }
    const foundEditItemCode = masterListData.find(
      (item) =>
        item.i_code?.toLowerCase().trim() === selItemCode.toLowerCase().trim(),
    );

    if (foundEditItemCode) {
      //USE FOR EDIT SELECTED ID
      setSelMName(foundEditItemCode.i_name || "");
      setSelSupp(foundEditItemCode.supp || "");
      setSelUnit(foundEditItemCode.uom || "");
      setSelConQty(foundEditItemCode.c_qty || "");
      setSelConUnit(foundEditItemCode.c_unit || "");
    } else {
      //USE FOR EDIT SELECTED ID
      setSelMName("");
      setSelSupp("");
      setSelUnit("");
      setSelConQty("");
      setSelConUnit("");
    }
  }, [selItemCode]);

  //SEARCH ITEM TO THE MASTERLIST
  useEffect(() => {
    if (!itemCode) {
      setMaterialName("");
      setSupplierName("");
      setUnit("");
      setConQty("");
      setConUnit("");
      setCategory("");
      return;
    }

    const foundItemCode = masterListData.find(
      (item) =>
        item.i_code?.toLowerCase().trim() === itemCode.toLowerCase().trim(),
    );

    if (foundItemCode) {
      setMaterialName(foundItemCode.i_name || "");
      setSupplierName(foundItemCode.supp || "");
      setUnit(foundItemCode.uom || "");
      setConQty(foundItemCode.c_qty || "");
      setConUnit(foundItemCode.c_unit || "");
      setCategory(foundItemCode.cat || "");
    } else {
      setMaterialName("");
      setSupplierName("");
      setUnit("");
      setConQty("");
      setConUnit("");
      setCategory("");
    }
  }, [itemCode, masterListData]);

  //FETCH ALL  DATA
  const fetchIssuanceData = async () => {
    try {
      setIsLoading(true); //SHOW A LOADING SCREEN

      const params = new URLSearchParams();
      console.log({
        search,
        dateFrom,
        dateTo,
      });

      console.log(
        `${process.env.REACT_APP_API_URL}/con/getdata?${params.toString()}`,
      );
      if (search.trim() !== "") {
        console.log(search);
        params.append("search", search);
      }

      if (dateFrom && dateTo) {
        params.append("dateFrom", dateFrom);
        params.append("dateTo", dateTo);
      }

      /* const res = await fetch(
        `${process.env.REACT_APP_API_URL}/con/getdata?search=${search}`,
      );
 */
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/con/getdata?${params.toString()}`,
      );

      const data = await res.json();
      setIssuanceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 150); // smooth UI fade-out
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchIssuanceData();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // useEffect(() => {
  //   const fetchData = () => {
  //     fetch(`${process.env.REACT_APP_API_URL}/con/getdata?search=${search}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setIssuanceData(data);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   };
  //   const timeoutId = setTimeout(() => {
  //     fetchData();
  //   }, 400); //debounce

  //   return () => clearTimeout(timeoutId);
  // }, [search]);

  //SEARCH DATE MODAL
  function handleSearchDateSubmit(e) {
    e.preventDefault();

    if (!dateFrom) {
      alert("Please select Date from!");
      return;
    }

    if (!dateTo) {
      alert("Please select Date to!");
      return;
    }

    if (dateFrom > dateTo) {
      alert(`"Date from" must not exceed the value in the "Date to"`);
      return;
    }

    if (dateTo < dateFrom) {
      alert(`"Date To" must be later than the "Date from"`);
      return;
    }

    fetchIssuanceData();
    setIsDateFilter(true); // adding trapping to the export button if the user did not filter the data in the table
    setShowSearchDate(false);
  }

  async function handleConfirmExport() {
    try {
      setIsLoading(true); //SHOW A LOADING SCREEN
      const res = await fetch(
        `
        ${process.env.REACT_APP_API_URL}/con/exportdata
        `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableData: issuanceData,
          }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to generate workbook");
      }

      const blob = await res.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      const excelFilename = `Consumable Data ${dateFrom} to ${dateTo}.xlsx`;
      link.href = downloadUrl;
      link.download = excelFilename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
      /*   if (res.ok) {
        alert("Exported sucessfuly");
      } */

      setDateFrom("");
      setDateTo("");
      setRefreshKey((prev) => prev + 1);
      setIsDateFilter(false); // removing the trapping in the export button if the data in the data is not filtered
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 150);
    }
  }

  function exportData() {
    if (issuanceData.length === 0) {
      alert("No data found to export!");
      return;
    }

    if (!isDateFilter) {
      alert("Data must be filtered before exporting!");
      return;
    }
    setShowConfirm(true);
  }

  function issueItemClearData() {
    setItemCode("");
    setReceivedDate(getLocalDate);
    setRisNum("");
    setMaterialName("");
    setSupplierName("");
    setUnit("");
    setSection("");
    setIssuedBy("");
    setConQty("");
    setConUnit("");
    setConvertedQty("");
    setCategory("");

    if (itemCodeRef.current) {
      itemCodeRef.current.focus();
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/con/insertdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            iCode: itemCode,
            rDate: receivedDate,
            risNum: risNum,
            mName: materialName,
            suppName: supplierName,
            unit: unit,
            sSection: section,
            iBy: issuedBy,
            iQty: convertedQty,
            category: category,
          }),
        },
      );

      //convert response to json to call the response.message
      const data = await response.json();

      if (!response.ok) {
        return alert(data.error || "Server Error");
      }
      if (data.success) {
        //clear specific field in the form
        setItemCode("");
        setMaterialName("");
        setSupplierName("");
        setUnit("");
        setConQty("");
        setConUnit("");
        setIssuedQty("");
        setConvertedQty("");

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1000);

        fetchIssuanceData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleDelete(id) {
    setDeleteId(id);
    setShowConfirmDelete(true);
  }
  async function handleConfirmDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(
        `
        ${process.env.REACT_APP_API_URL}/con/deleteselected/${deleteId}`,
        {
          method: "DELETE",
        },
      );
      /*  const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      } */

      //refresh the table data
      fetchIssuanceData();
      setShowConfirmDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfirmEdit() {
    if (!editId) return;
    try {
      const res = await fetch(
        `
        ${process.env.REACT_APP_API_URL}/con/updateselected/${editId}
        `,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            risNum: selRisNum,
            section: selSection,
            convertedQty: selConvertedQty,
          }),
        },
      );

      fetchIssuanceData();
      setShowConfirmEdit(false);
      setShowEditModal(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(item) {
    setEditId(item.id);
    setSelItemCode(item.i_code);
    setSelDate(item.d_received);
    setSelRisNum(item.ris_num);
    setSelIssuedBy(item.i_by);
    setSelSection(item.section);
    setSelConvertedQty(item.i_qty);

    const foundEditItemCode = masterListData.find(
      (data) =>
        data.i_code?.toLowerCase().trim() === item.i_code.toLowerCase().trim(),
    );

    if (foundEditItemCode) {
      const editConQty = parseFloat(foundEditItemCode.c_qty || "");
      const editConvertedQty = parseFloat(item.i_qty || "");

      const total = editConQty * editConvertedQty;

      const formattedTotal = total.toFixed(4);

      setSelIssuedQty(formattedTotal);
    }

    setShowEditModal(true);
  }

  //HANDLE EDIT SUBMIT FORM
  function handleEditSubmit(e) {
    e.preventDefault();

    if (!editId) return;

    try {
    } catch (err) {
      console.error(err);
    }
  }

  /*   useEffect(() => {
    if (showSearchDate) {
      if (!dateFrom) setDateFrom(getLocalDate);
      if (!dateTo) setDateTo(getLocalDate);
    }
  }, [showSearchDate]); */
  //===================================================================================
  // RETURN
  //===================================================================================

  return (
    <div className="con-mgmt-page">
      {/* ADD MATERIAL */}
      {showAddMaterialModal && (
        <div className="con-mgmt-addmaterial-overlay">
          <div className="con-mgmt-addmaterial-modal">
            <AddMaterial
              closeAddMaterial={() => {
                setShowAddmaterialModal(close);
              }}
            />
          </div>
        </div>
      )}
      {/* SHOW LOADING SCREEN */}
      {isLoading && (
        <div className="con-mgmt-loading-overlay">
          <div className="con-mgmt-loading-modal">
            <div className="con-mgmt-loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        </div>
      )}

      {/* SHOW CONFIRM DELETE */}
      {showConfirmDelete && (
        <div className="con-mgmt-confirmdelete-overlay">
          <div className="con-mgmt-confirmdelete-modal">
            <h2>Delete Confirmation</h2>
            <p>Are you sure you want to delete the Selected Id: {deleteId}</p>
            <div className="con-mgmt-confirmdelete-button-container">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOW CONFIRM EDIT */}
      {showConfirmEdit && (
        <div className="con-mgmt-confirmedit-overlay">
          <div className="con-mgmt-confirmedit-modal">
            <h2>Update Confirmation</h2>
            <p>Are you sure you want to update the Selected Id: {editId}</p>
            <div className="con-mgmt-confirmedit-button-container">
              <button onClick={handleConfirmEdit}>Yes</button>
              <button
                onClick={() => {
                  setShowConfirmEdit(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOW EDIT MODAL */}
      {showEditModal && (
        <div className="con-mgmt-edit-overlay">
          <div className="con-mgmt-edit-modal">
            <button
              className="con-modal-edit-close-btn"
              onClick={() => {
                setShowEditModal(false);
              }}
            >
              X
            </button>
            <h2>Selected Item</h2>
            <form className="con-modal-edit-form" onSubmit={handleEditSubmit}>
              <div className="con-modal-edit-group">
                <label>ID :</label>
                <label>{editId || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>Item Code :</label>
                <label>{selItemCode || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>Date :</label>
                <label>{selDate || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>RIS Control # :</label>
                <input
                  required
                  type="text"
                  maxLength={8}
                  value={selRisNum}
                  onChange={(e) => {
                    setSelRisNum(e.target.value);
                  }}
                />
              </div>
              <div className="con-modal-edit-group">
                <label>Material Name :</label>
                <label>{selMName || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>Supplier :</label>
                <label>{selSupp || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>Unit :</label>
                <label>{selUnit || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>Section :</label>
                <select
                  required
                  value={selSection}
                  onChange={(e) => {
                    setSelSection(e.target.value);
                  }}
                >
                  {sectionList.map((item, index) => (
                    <option key={index} value={item.section}>
                      {item.section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="con-modal-edit-group">
                <label>Issued By :</label>
                <label>{selIssuedBy || "-"}</label>
              </div>
              <div className="con-modal-edit-group">
                <label>Issued Qty. :</label>
                <input
                  required
                  type="text"
                  value={selIssuedQty}
                  onChange={(e) => {
                    const value = e.target.value;

                    //allow only numbers and decimal
                    if (!/^\d*\.?\d{0,4}$/.test(value)) return;

                    setSelIssuedQty(value);
                    const iQty = parseFloat(value) || 0;
                    const cQty = parseFloat(selConQty) || 0;
                    if (!value) {
                      setSelConvertedQty("");
                      return;
                    }

                    if (cQty !== 0) {
                      const result = (iQty / cQty).toFixed(4);
                      setSelConvertedQty(result);
                    } else {
                      setSelConvertedQty("");
                    }
                  }}
                />
              </div>
              <div className="con-modal-edit-group">
                <label htmlFor="">Convertion</label>
                <div className="con-modal-edit-convertion-container">
                  <label>Quantity :</label>
                  <label>{selConQty || "-"}</label>
                  <label>Unit :</label>
                  <label>{selConUnit || "-"}</label>
                </div>
              </div>
              <div className="con-modal-edit-group">
                <label>Converted Qty. : </label>
                <label required>{selConvertedQty || "-"}</label>
              </div>

              {showEditSuccess && (
                <div className="con-modal-edit-success-container">
                  <p>Saved successfully</p>
                </div>
              )}

              <div className="con-modal-edit-group">
                <button
                  onClick={() => {
                    setShowConfirmEdit(true);
                  }}
                >
                  <img src={CON_IMAGE.all_savebtn} alt="Save Changes" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="con-mgmt-confirm-overlay">
          <div className="con-mgmt-confirm-modal">
            <h2>Confirmation</h2>
            <p>Are you sure you want to export the display data?</p>
            <div className="con-mgmt-confirm-modal-button-container">
              <button onClick={handleConfirmExport}>Confirm</button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* SEARCH DATE MODAL */}
      {showSearchDate && (
        <div className="con-mgmt-searchdate-overlay">
          <form
            className="con-mgmt-searchdate-modal"
            onSubmit={handleSearchDateSubmit}
          >
            <h2>Search Date</h2>
            <div className="con-mgmt-searchdate-date-container">
              <label>Date from :</label>
              <input
                type="date"
                required
                value={dateFrom}
                max={dateTo}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                }}
              />
            </div>
            <div className="con-mgmt-searchdate-date-container">
              <label>Date to :</label>
              <input
                type="date"
                required
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                }}
              />
            </div>
            <div className="con-mgmt-searchdate-button-container">
              <button type="submit">
                <img
                  src={CON_IMAGE.main_searchdate_filterbtn}
                  alt="Filter Btn"
                />
                Filter
              </button>
              <button
                onClick={() => {
                  setShowSearchDate(false);
                }}
              >
                <img
                  src={CON_IMAGE.main_addmaterial_closebtn}
                  alt="Cancel Button"
                />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ISSUE ITEM */}
      {issueItemModal && (
        <div className="con-mgmt-overlay">
          <div className="con-mgmt-modal">
            <button
              className="con-modal-close-btn"
              onClick={() => {
                setIssueItemModal(false);
              }}
            >
              X
            </button>
            <h2>Please Scan the QR Code</h2>
            <form className="con-modal-form" onSubmit={handleSubmit}>
              <div className="con-modal-group">
                <label>Item Code :</label>
                <input
                  type="text"
                  ref={itemCodeRef}
                  value={itemCode}
                  onChange={(e) => {
                    setItemCode(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="con-modal-group">
                <label>Date :</label>
                <input
                  type="date"
                  value={receivedDate}
                  required
                  onChange={(e) => {
                    setReceivedDate(e.target.value);
                  }}
                />
              </div>
              <div className="con-modal-group">
                <label>RIS Control # :</label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  value={risNum}
                  onChange={(e) => {
                    setRisNum(e.target.value);
                  }}
                />
              </div>
              <div className="con-modal-group">
                <label>Material Name :</label>
                <label value={materialName}>{materialName || "-"}</label>
              </div>
              <div className="con-modal-group">
                <label>Supplier :</label>
                <label value={supplierName}>{supplierName || "-"}</label>
              </div>
              <div className="con-modal-group">
                <label>Unit :</label>
                <label value={unit}>{unit || "-"}</label>
              </div>
              <div className="con-modal-group">
                <label>Section :</label>
                <select
                  required
                  value={section}
                  onChange={(e) => {
                    setSection(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  {sectionList.map((item, index) => (
                    <option key={index} value={item.section}>
                      {item.section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="con-modal-group">
                <label>Issued By :</label>
                <select
                  required
                  value={issuedBy}
                  onChange={(e) => {
                    setIssuedBy(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  {staffList.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="con-modal-group">
                <label htmlFor="">Issued Qty. :</label>
                <input
                  type="text"
                  required
                  value={issuedQty}
                  onChange={(e) => {
                    const value = e.target.value;

                    //allow only numbers and decimal
                    if (!/^\d*\.?\d{0,4}$/.test(value)) return;

                    setIssuedQty(value);
                    const iQty = parseFloat(value) || 0;
                    const cQty = parseFloat(conQty) || 0;

                    if (!value) {
                      setConvertedQty("-");
                      return;
                    }

                    if (cQty !== 0) {
                      const result = (iQty / cQty).toFixed(4);
                      setConvertedQty(result);
                    } else {
                      setConvertedQty("");
                    }
                  }}
                />
              </div>
              <div className="con-modal-group">
                <label htmlFor="">Convertion</label>
                <div className="con-modal-convertion-container">
                  <label>Quantity :</label>
                  <label value={conQty}>{conQty || "-"}</label>
                  <label>Unit :</label>
                  <label value={conUnit}>{conUnit || "-"}</label>
                </div>
              </div>
              <div className="con-modal-group">
                <label htmlFor="">Converted Qty. : </label>
                <label value={convertedQty}>{convertedQty || "-"}</label>
              </div>
              {showSuccess && (
                <div className="con-modal-success-container">
                  <p>Saved successfully</p>
                </div>
              )}

              <div className="con-modal-group">
                <button>
                  <img src={CON_IMAGE.all_savebtn} alt="Save Button" />
                  Save
                </button>
                <button onClick={issueItemClearData}>
                  <img
                    src={CON_IMAGE.main_issueitem_clearbtn}
                    alt="Clear Button"
                  />
                  Clear Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="con-mgmt-container">
        <div className="con-mgmt-header-container">
          <div className="con-mgmt-header-group con-mgmt-header-btn">
            <div className="con-mgmt-header-admin-btn">
              <button
                onClick={() => {
                  setShowAddmaterialModal(true);
                }}
              >
                <img
                  src={CON_IMAGE.main_addmaterialbtn}
                  alt="Add Material Button"
                />
                Add Material
              </button>
              <button
                onClick={() => {
                  setIssueItemModal(true);
                }}
              >
                <img
                  src={CON_IMAGE.main_issueitembtn}
                  alt="Issue Item Button"
                />
                Issue Item
              </button>
            </div>

            <div className="con-mgmt-exportdata-container">
              <button onClick={exportData}>
                <img src={CON_IMAGE.main_exportbtn} alt="Export Button" />
                Export Data
              </button>
            </div>
          </div>
          <div className="con-mgmt-header-group">
            <div className="con-mgmt-header-group-search-container">
              <label htmlFor="">Search</label>
              <input
                value={search}
                onChange={(e) => {
                  setDateFrom("");
                  setDateTo("");
                  setSearch(e.target.value);
                }}
                type="search"
                placeholder="🔍 Search Section,Item Code, Material name..."
              />
            </div>
            <div className="con-mgmt-header-group-searchdate-container">
              <button
                onClick={() => {
                  setSearch("");
                  fetchIssuanceData();
                  /* setDateFrom(getLocalDate);
                  setDateTo(getLocalDate); */
                  setShowSearchDate(true);
                }}
              >
                🔍 Search by date
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="con-mgmt-table-wrapper">
          <div className="con-mgmt-table-container">
            <TableVirtuoso
              className="con-mgmt-table-virtuoso"
              data={issuanceData}
              components={{
                Table: (props) => (
                  <table {...props} className="con-mgmt-table" />
                ),
                TableHead: (props) => <thead {...props} />,
                TableRow: (props) => <tr {...props} />,
                TableBody: (props) => <tbody {...props} />,
              }}
              fixedHeaderContent={() => (
                <tr>
                  <th>No.</th>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Section</th>
                  <th>Item Code</th>
                  <th>Material Name</th>
                  <th>Unit</th>
                  <th>Issued Qty</th>
                  <th>Issued By</th>
                  <th>Category</th>
                  <th>RIS #</th>
                  <th>Action</th>
                </tr>
              )}
              itemContent={(index, item) => (
                <>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.d_received}</td>
                  <td>{item.section}</td>
                  <td>{item.i_code}</td>
                  <td>{item.m_name}</td>
                  <td>{item.unit}</td>
                  <td>{item.i_qty}</td>
                  <td>{item.i_by}</td>
                  <td>{item.cat}</td>
                  <td>{item.ris_num}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          handleEdit(item);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </>
              )}
            />
            {/* <table className="con-mgmt-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Section</th>
                  <th>Item Code</th>
                  <th>Material Name</th>
                  <th>Unit</th>
                  <th>Issued Quantity</th>
                  <th>Issued By</th>
                  <th>Category</th>
                  <th>RIS #</th>
                </tr>
              </thead>
              <tbody>
                {issuanceData.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.d_received}</td>
                    <td>{item.section}</td>
                    <td>{item.i_code}</td>
                    <td>{item.m_name}</td>
                    <td>{item.unit}</td>
                    <td>{item.i_qty}</td>
                    <td>{item.i_by}</td>
                    <td>{item.cat}</td>
                    <td>{item.ris_num}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <div className="con-mgmt-footer-container">
        <p>
          Total Records : <span>{issuanceData.length}</span>
        </p>
      </div>
    </div>
  );
}
