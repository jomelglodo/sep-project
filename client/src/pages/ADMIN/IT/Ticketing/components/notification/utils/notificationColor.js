export function getNotificationColor(type) {
  switch (type) {
    case "ticket-created":
      return "#2563eb";

    case "ticket-assigned":
      return "#9333ea";

    case "ticket-starttroubleshoot":
      return "#f59e0b";

    case "ticket-resolved":
      return "#16a34a";

    case "ticket-closed":
      return "#6b7280";

    case "ticket-reopened":
      return "#dc2626";

    case "ticket-comment":
      return "#0891b2";

    case "system":
      return "#0f766e";

    default:
      return "#64748b";
  }
}
