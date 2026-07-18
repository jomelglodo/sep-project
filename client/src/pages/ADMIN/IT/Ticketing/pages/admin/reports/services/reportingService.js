const API = process.env.REACT_APP_API_URL;

export async function getSummaryReport() {
  const response = await fetch(`${API}/ticketing/reporting/summary`);

  if (!response.ok) {
    throw new Error("Failed to load report.");
  }

  return response.json();
}
