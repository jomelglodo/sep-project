import styles from "./AnnouncementManagement.module.css";
import { useEffect, useState } from "react";

//components
import AnnouncementToolbar from "./components/AnnouncementToolbar";
import AnnouncementFilter from "./components/AnnouncementFilters";
import AnnouncementTable from "./components/AnnouncementTable";

//reusable pagination from ticket history
import Pagination from "../reports/tickethistory/components/Pagination.jsx";

//hooks
import useAnnouncementManagement from "./hooks/useAnnouncementManagement.js";
import {
  deleteAnnouncement,
  toggleAnnouncementPublish,
  toggleAnnouncementPin,
} from "./services/announcementService.js";

//create announcement component
import AnnouncementModal from "./components/AnnouncementModal.jsx";
import AnnouncementForm from "./components/AnnouncementForm";
import { toast } from "react-toastify";

import successSound from "../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";
import warningSound from "../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastWarning.mp3";

export default function AnnouncementManagement({ loggedinUserId }) {
  const successAudio = new Audio(successSound);
  const warningAudio = new Audio(warningSound);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const {
    announcements,
    loading,
    pagination,
    filters,
    setFilters,
    changePage,
    changePageSize,
    loadAnnouncements,
  } = useAnnouncementManagement();

  //HELPER FUNCTION
  //handle delete
  async function handleDelete(announcement) {
    const confirmed = window.confirm(`Delete "${announcement.title}"?`);

    if (!confirmed) return;

    try {
      await deleteAnnouncement(announcement.announcement_id);

      successAudio.play();
      toast.success("Announcement deleted successfully");
      loadAnnouncements();
    } catch (err) {
      console.error(err);

      warningAudio.play();
      toast.error(
        err.response?.data?.message || "Failed to delete announcement",
      );
    }
  }

  //handle publish
  async function handleTogglePublish(announcement) {
    try {
      const result = await toggleAnnouncementPublish(
        announcement.announcement_id,
      );

      successAudio.play();
      toast.success(result.message);
      loadAnnouncements();
    } catch (err) {
      console.error(err);

      warningAudio.play();
      toast.error(
        err.response?.data?.message || "Unable to update announcement",
      );
    }
  }

  //handle pin
  async function handleTogglePin(announcement) {
    try {
      const result = await toggleAnnouncementPin(announcement.announcement_id);

      successAudio.play();
      toast.success(result.message);
      loadAnnouncements();
    } catch (err) {
      console.error(err);

      warningAudio.play();
      toast.error(err.response?.data?.message || "Failed to update pin status");
    }
  }
  return (
    <div className={styles.container}>
      {/* <AnnouncementForm loggedinUserId={loggedinUserId} /> */}
      <AnnouncementToolbar
        onCreate={() => {
          setSelectedAnnouncement(null);
          setOpenCreate(true);
        }}
      />
      <AnnouncementFilter filters={filters} onChange={setFilters} />
      <AnnouncementTable
        announcements={announcements}
        loading={loading}
        onEdit={(announcement) => {
          setSelectedAnnouncement(announcement);
          setOpenCreate(true);
        }}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        onTogglePin={handleTogglePin}
      />
      <Pagination
        page={filters.page}
        totalPages={pagination.totalPages}
        pageSize={filters.limit}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
      />
      {/* CREATE ANNOUNCEMENT MODAL */}
      {openCreate && (
        <AnnouncementModal
          title={
            selectedAnnouncement ? "Edit Announcement" : "Create Announcement"
          }
          onClose={() => setOpenCreate(false)}
        >
          <AnnouncementForm
            announcement={selectedAnnouncement}
            loggedinUserId={loggedinUserId}
            onSuccess={() => {
              setOpenCreate(false);
              loadAnnouncements();
            }}
          />
        </AnnouncementModal>
      )}
    </div>
  );
}
