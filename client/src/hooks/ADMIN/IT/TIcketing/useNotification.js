import { useContext } from "react";
import NotificationContext from "../../../../context/ADMIN/IT/Ticketing/NotificationContext";

export default function useNotification() {
  return useContext(NotificationContext);
}
