import axios from "axios";
const API = process.env.REACT_APP_API_URL;
export async function getTimeline(ticketId) {
  const response = await axios.get(`${API}/ticketing/timeline/${ticketId}`);

  return response.data;
}
