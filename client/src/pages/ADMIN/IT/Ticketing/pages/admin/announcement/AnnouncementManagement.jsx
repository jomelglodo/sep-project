import AnnouncementForm from "./components/AnnouncementForm";

export default function AnnouncementManagement({ loggedinUserId }) {
  return <AnnouncementForm loggedinUserId={loggedinUserId} />;
}
