import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export async function getTicket(ticketId) {
  const response = await axios.get(`${API}/ticketing/inspector/${ticketId}`);

  return response.data.ticket;
}
