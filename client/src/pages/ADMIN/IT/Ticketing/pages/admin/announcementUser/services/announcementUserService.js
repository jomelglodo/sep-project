import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export async function getUserAnnouncement({ search, category }) {
  const response = await axios.get(`${API}/ticketing/announcement/user`, {
    params: {
      search,
      category,
    },
  });

  return response.data;
}

//get details of the selected announcement
export async function getAnnouncementDetails(announcementId) {
  const response = await axios.get(
    `${API}/ticketing/announcement/user/${announcementId}`,
  );
  return response.data.announcement;
}

//download attachment
export async function downloadAnnouncementFile(fileId) {
  const response = await axios.get(
    `${API}/ticketing/announcement/file/${fileId}`,
    {
      responseType: "blob",
    },
  );

  const contentDisposition = response.headers["content-disposition"];

  let filename = "download";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);

    if (match) {
      filename = match[1];
    }
  }

  return {
    blob: response.data,
    filename,
  };
}

//preview attachment
export async function getPreviewUrl(fileId) {
  return `${API}/ticketing/announcement/file/${fileId}/preview`;
}
