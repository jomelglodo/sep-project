import React, { useEffect, useState, useRef } from "react";
import "./Ticket_UpdateProfile.css";
import { toast } from "react-toastify";

export default function MainUpdateProfile({
  loggedinUserId,
  closeModal,
  onDisplayNameChange,
  onProfileImageChange,
}) {
  const [departmentList, setDepartmentList] = useState([]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentFilename, setAttachmentFilename] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  //REFS
  const displayNameRef = useRef(null);

  //CONFIRMATION MODAL
  const [showChangesConfirmation, setShowChangesConfirmation] = useState(false);

  //EFFECTS
  useEffect(() => {
    if (displayNameRef.current) {
      displayNameRef.current.focus();
    }
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

  async function handleConfirmChanges() {
    const formData = new FormData();
    formData.append("displayname", displayName);
    formData.append("email", email);
    formData.append("department", department);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ticketing/main/applychanges/${loggedinUserId}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        onDisplayNameChange(displayName);
        setShowChangesConfirmation(false);
        closeModal();

        //update the profile image display on the topbar
        onProfileImageChange();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
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
              <button onClick={handleConfirmChanges}>Yes</button>
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
              ref={displayNameRef}
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
              <option value="" disabled>
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
