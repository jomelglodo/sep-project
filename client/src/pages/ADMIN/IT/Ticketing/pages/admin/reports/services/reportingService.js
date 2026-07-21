import axios from "axios";

const API = process.env.REACT_APP_API_URL;

//TICKET SUMMARY
export async function getSummaryReport() {
  const response = await fetch(`${API}/ticketing/reporting/summary`);

  if (!response.ok) {
    throw new Error("Failed to load report.");
  }

  return response.json();
}

//TICKET HISTORY

export async function getTicketHistory(filters) {
  const { data } = await axios.get(`${API}/ticketing/reporting/history`, {
    params: filters,
  });
  /*   console.log(
    "Data:" +
      data.pagination.page +
      "==LIMIT:" +
      data.pagination.limit +
      "==total:" +
      data.pagination.total +
      "==totalpages:" +
      data.pagination.totalpages,
  ); */
  return data;
}

export async function getReportingLookups() {
  const { data } = await axios.get(`${API}/ticketing/reporting/lookups`);

  return data;
}

export async function exportTicketHistory(filters) {
  const response = await axios.get(`${API}/ticketing/reporting/export`, {
    params: filters,
    responseType: "blob",
  });

  return response;
}
