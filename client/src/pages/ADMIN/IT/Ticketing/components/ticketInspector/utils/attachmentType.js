export function getAttachmentType(mimeType = "") {
  if (!mimeType) return "unknows";

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (
    mimeType.includes("word") ||
    mimeType.includes("officedocumnet.wordprocessingml")
  ) {
    return "word";
  }

  if (mimeType.includes("excel") || mimeType.includes("spreadsheetml")) {
    return "excel";
  }

  if (mimeType.includes("powerpoint") || mimeType.includes("presentationml")) {
    return "powerpoint";
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  ) {
    return "archive";
  }
  if (mimeType.startsWith("text/")) {
    return "text";
  }

  return "unknown";
}
