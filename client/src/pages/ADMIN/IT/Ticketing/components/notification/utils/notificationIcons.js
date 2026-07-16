import {
  Ticket,
  UserPlus,
  Wrench,
  CheckCircle2,
  Lock,
  CircleAlert,
  MessageSquare,
  Bell,
  Info,
} from "lucide-react";

export function getNotificationIcon(type) {
  switch (type) {
    case "ticket-created":
      return Ticket;
    case "ticket_assigned":
      return UserPlus;
    case "ticket-starttroubleshoot":
      return Wrench;
    case "ticket-resolved":
      return CheckCircle2;
    case "ticket-closed":
      return Lock;
    case "ticket-reopened":
      return CircleAlert;
    case "ticket-comment":
      return MessageSquare;
    case "system":
      return Info;
    default:
      return Bell;
  }
}
