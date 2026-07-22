import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export async function createAnnouncement(formData) {
  const { data } = await axios.post(
    `${API}/ticketing/announcement`,
    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
}
