import axios from "axios";
const API = process.env.REACT_APP_API_URL;

//get dashboard details
export async function getAnnouncementDashboard() {
  const response = await axios.get(`${API}/ticketing/announcement/dashboard`);

  return response.data.dashboard;
}

//get category summary
export async function getAnnouncementCategorySummary() {
  const response = await axios.get(
    `${API}/ticketing/announcement/dashboard/categories`,
  );

  return response.data.categories;
}

// get recent announcement
export async function getRecentAnnouncements() {
  const response = await axios.get(
    `${API}/ticketing/announcement/dashboard/recent`,
  );

  return response.data.announcements;
}
