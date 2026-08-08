import axios from "axios";

const API = process.env.REACT_APP_API_URL;

//get announcement
export async function getAnnouncements(filters) {
  const { data } = await axios.get(`${API}/ticketing/announcement`, {
    params: filters,
  });

  return data;
}

//create announcement
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

//update announcement
export async function updateAnnouncement(announcementId, formData) {
  const { data } = await axios.put(
    `${API}/ticketing/announcement/${announcementId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

//delete announcement
export async function deleteAnnouncement(announcementId) {
  const { data } = await axios.delete(
    `${API}/ticketing/announcement/${announcementId}`,
  );

  return data;
}

//toggle publish
export async function toggleAnnouncementPublish(
  announcementId,
  loggedinUserId,
  displayName,
) {
  const { data } = await axios.patch(
    `${API}/ticketing/announcement/${announcementId}/publish`,
    {
      loggedinUserId,
      displayName,
    },
  );

  return data;
}

//toggle pin

export async function toggleAnnouncementPin(announcementId) {
  const { data } = await axios.patch(
    `${API}/ticketing/announcement/${announcementId}/pin`,
  );

  return data;
}
