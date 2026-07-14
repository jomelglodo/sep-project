import { createContext, useContext, useMemo, useEffect, useState } from "react";
import socket from "../../../../services/socket.js";
import { getNotifications } from "../../../../services/ADMIN/IT/Ticketing/notificationService.js";

const NotificationContext = createContext();

export function NotificationProvider({ children, userId, isLoggedIn, role }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    loadNotifications();
  }, [userId]);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await getNotifications(userId);

      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    const handleNotification = (notification) => {
      console.log("New notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };
    //  {#c27,6}

    socket.on("notification", handleNotification);
    console.log(handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [userId, isLoggedIn]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const value = {
    notifications,
    setNotifications,
    loading,
    setLoading,
    unreadCount,
    loadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
