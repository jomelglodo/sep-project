import styles from "./AnnouncementUser.module.css";

//components
import AnnouncementSearch from "./components/AnnouncementSearch";
import AnnouncementList from "./components/AnnouncementList";
import AnnouncementViewerModal from "./components/AnnouncementViewerModal";

import useAnnouncementUser from "./hooks/useAnnouncementUser.js";

export default function AnnouncementUser() {
  const {
    announcements,
    loading,
    search,
    setSearch,

    selectedAnnouncement,
    openAnnouncements,
    closeAnnouncement,
  } = useAnnouncementUser();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Company Announcements</h2>

      <AnnouncementSearch search={search} onChange={setSearch} />

      <AnnouncementList
        announcement={announcements}
        loading={loading}
        onReadMore={openAnnouncements}
      />

      {selectedAnnouncement && (
        <AnnouncementViewerModal
          announcement={selectedAnnouncement}
          onClose={closeAnnouncement}
        />
      )}
    </div>
  );
}
