import {
  CirclePlus,
  Wrench,
  MessageSquare,
  CircleCheck,
  CircleX,
  RotateCcw,
  UserPlus,
  Paperclip,
} from "lucide-react";

export function getTimelineIcon(type) {
  switch (type) {
    case "ticket-created":
      return CirclePlus;

    case "ticket-starttroubleshoot":
      return Wrench;

    case "ticket-comment":
      return MessageSquare;

    case "ticket-closed":
      return CircleCheck;

    case "ticket-reopened":
      return RotateCcw;

    case "ticket-assigned":
      return UserPlus;

    case "ticket-attachment":
      return Paperclip;

    default:
      return CircleX;
  }
}
