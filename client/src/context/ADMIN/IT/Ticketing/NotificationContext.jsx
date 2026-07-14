import { createContext, useContext, useMemo, useEffect, useState } from "react";
import socket from "../../../../services/socket.js";
import {
  getNotifications,
  markNotification,
  markAllNotificationsRead,
} from "../../../../services/ADMIN/IT/Ticketing/notificationService.js";

const NotificationContext = createContext();

export function NotificationProvider({ children, userId, isLoggedIn, role }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [, forceUpdate] = useState(0);

  //force to render every minute to update the notification time created
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    loadNotifications();
  }, [userId]);

  //get notification
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

  //mark as read the notification
  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
      await markNotification(notificationId);
    } catch (err) {
      console.error(err);
      loadNotifications();
    }
  };

  //mark as read all notifications
  const handleMarkAllAsRead = async () => {
    const previous = notifications;

    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, is_read: true })),
    );

    try {
      await markAllNotificationsRead(userId);
    } catch (err) {
      console.error(err);
      setNotifications(previous);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    const handleNotification = (notification) => {
      console.log("New notification:", notification);
      /*  setNotifications((prev) => [notification, ...prev]); */
      setNotifications((prev) => {
        const exists = prev.some(
          (n) => n.notification_id === notification.notification_id,
        );

        if (exists) return prev;

        return [notification, ...prev];
      });
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
    handleMarkAsRead,
    handleMarkAllAsRead,
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
