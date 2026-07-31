import { useEffect, useState } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
} from "../services/announcementService.js";
import { toast } from "react-toastify";
import toastSuccessSound from "../../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";
import toastWarningSound from "../../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastWarning.mp3";

export default function useAnnouncementForm({ onSuccess, announcement }) {
  const toastSuccessAudio = new Audio(toastSuccessSound);
  const toastWarningAudio = new Audio(toastWarningSound);

  const [userId, setUserId] = useState("");
  // Basic Information
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");

  // Publication Settings
  const [isPublished, setIsPublished] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  // Attachments
  const [files, setFiles] = useState([]);

  //EFFECTS
  useEffect(() => {
    if (!announcement) return;

    setTitle(announcement.title ?? "");
    setContent(announcement.content ?? "");
    setCategory(announcement.category ?? "");
    setIsPublished(announcement.is_published ?? "");
    setIsPinned(announcement.is_pinned ?? "");

    setExpiryDate(
      announcement.expiry_date ? announcement.expiry_date.slice(0, 10) : "",
    );
  }, [announcement]);

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);

    if (!selectedFiles.length) return;

    setFiles((prev) => {
      const uniqueFiles = selectedFiles.filter(
        (newFile) =>
          !prev.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size,
          ),
      );

      return [...prev, ...uniqueFiles];
    });

    // Allow selecting the same file again later
    event.target.value = "";
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function clearFiles() {
    setFiles([]);
  }

  async function handleSubmit() {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("postedBy", Number(userId));

      formData.append("isPublished", isPublished);
      formData.append("isPinned", isPinned);
      formData.append("expiryDate", expiryDate);

      files.forEach((file) => {
        formData.append("files", file);
      });

      /*  await createAnnouncement(formData);

      toastSuccessAudio.play();
      toast.success("Announcement created successfully."); */

      if (announcement) {
        await updateAnnouncement(announcement.announcement_id, formData);
        toastSuccessAudio.play();
        toast.success("Announcement updated successfully.");
      } else {
        await createAnnouncement(formData);

        toastSuccessAudio.play();
        toast.success("Announcement created successfully.");
      }

      //reset form
      if (!announcement) {
        setTitle("");
        setCategory("");
        setContent("");

        setIsPublished(true);
        setIsPinned(false);
        setExpiryDate("");

        clearFiles();
      }

      onSuccess?.();
    } catch (err) {
      console.error(err.response);

      toastWarningAudio.play();
      toast.error(
        err.response?.data?.message || "Failed to create announcement",
      );
    }
  }

  return {
    // Values
    title,
    category,
    content,
    isPublished,
    isPinned,
    expiryDate,
    files,

    // Setters
    setUserId,
    setTitle,
    setCategory,
    setContent,
    setIsPublished,
    setIsPinned,
    setExpiryDate,

    // Attachment Helpers
    handleFileChange,
    removeFile,
    clearFiles,
    handleSubmit,
  };
}
