import {
  FileImage,
  FileText,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  File,
} from "lucide-react";

export function getAttachmentIcon(type) {
  switch (type) {
    case "image":
      return FileImage;

    case "pdf":
      return FileText;

    case "word":
      return FileText;

    case "excel":
      return FileSpreadsheet;

    case "powepoint":
      return FileSpreadsheet;

    case "archive":
      return FileArchive;

    case "text":
      return FileCode;

    default:
      return File;
  }
}
