import React, { useEffect, useState, useRef } from "react";
import "./Ticket_UpdateProfile.css";

export default function mainUpdateProfile({ loggedinUserId }) {
  const [departmentList, setDepartmentList] = useState([]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentFilename, setAttachmentFilename] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  //CONFIRMATION MODAL
  const [showChangesConfirmation, setShowChangesConfirmation] = useState(false);

  //EFFECTS
  useEffect(() => {
    fetchProfileData();
    fetchDepartment();
  }, []);

  //APIs
  const fetchDepartment = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/main/getdepartments`,
      )
        .then((res) => res.json())
        .then((data) => {
          setDepartmentList(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `
        ${process.env.REACT_APP_API_URL}/ticketing/main/profiledata/${loggedinUserId}
        `,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data) {
        setUsername(data.username);
        setDisplayName(data.d_name);
        setEmail(data.email);
        setRole(data.role);
        setDepartment(data.department);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //EVENT HANDLERS
  function handleSubmitChanges(e) {
    e.preventDefault();
    setShowChangesConfirmation(true);
  }

  function handleConfirmChanges() {
    const formData = new FormData();
    try {
      formData.append("displayname", displayName);
      formData.append("email", email);
      formData.append("deparment", department);
    } catch (err) {
      console.error(err);
    }
  }

  //HELPER FUNCTIONS
  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;
    setAttachment(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
  }

  return (
    <div className="ticket-main-updateprofile-container">
      {showChangesConfirmation && (
        <div className="ticket-main-updateprofile-overlay">
          <div className="ticket-main-updateprofile-modal">
            <div className="ticket-main-updateprofile-modal-header">
              <h2>Confirmation</h2>
              <p>Are you sure you want to apply the changes?</p>
            </div>
            <div className="ticket-main-updateprofile-modal-buttons">
              <button>Yes</button>
              <button
                onClick={() => {
                  setShowChangesConfirmation(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="ticket-main-updateprofile-header">
        <h2>Update Profile</h2>
      </div>
      <div className="ticket-main-updateprofile-body">
        {/* Profile Image */}
        <div className="ticket-main-updateprofile-image-section">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile Image"
              className="ticket-main-updateprofile-image"
            />
          ) : (
            <img
              src={`${process.env.REACT_APP_API_URL}/ticketing/main/profileimage/${loggedinUserId}`}
              alt="Profile Image"
              className="ticket-main-updateprofile-image"
            />
          )}

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {/* FORM FIELDS */}
        <form
          action=""
          className="ticket-main-updateprofile-form"
          onSubmit={handleSubmitChanges}
        >
          <div className="ticket-main-updateprofile-form-group">
            <label>User ID</label>
            <input type="text" readOnly value={loggedinUserId} />
          </div>
          <div className="ticket-main-updateprofile-form-group">
            <label>Username</label>
            <input type="text" readOnly value={username} />
          </div>
          <div className="ticket-main-updateprofile-form-group">
            <label>Display Name</label>
            <input
              required
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
          </div>
          <div className="ticket-main-updateprofile-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="ticket-main-updateprofile-form-group">
            <label>Role</label>
            <input type="text" readOnly value={role} />
          </div>
          <div className="ticket-main-updateprofile-form-group">
            <label>Department</label>
            <select
              required
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            >
              <option value="" disabled selected>
                --Select Department--
              </option>
              {departmentList.map((item, index) => (
                <option key={index} value={item.department}>
                  {item.department}
                </option>
              ))}
            </select>
          </div>

          <div className="ticket-main-updateprofile-button-container">
            <button
              type="submit"
              className="ticket-main-updateprofile-applybtn"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
