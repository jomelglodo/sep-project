import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export async function getNotifications(userId) {
  /* const { data } = await axios.get(`${API}/ticketing/notifications/${userId}`); */
  const response = await axios.get(`${API}/ticketing/notifications/${userId}`);

  return response.data;
}

export async function markNotification(notificationId) {
  await axios.put(`${API}/ticketing/notifications/${notificationId}/read`);
}

export async function markAllNotificationsRead(userId) {
  await axios.put(`${API}/ticketing/notifications/${userId}/read-all`);
}
