export function getTimelineColor(type) {
  switch (type) {
    case "ticket-created":
      return "#2563eb";

    case "ticket-starttroubleshoot":
      return "#ea580c";

    case "ticket-closed":
      return "#16a34a";

    case "ticket-reopened":
      return "#9333ea";

    case "ticket-attachment":
      return "#0891b2";

    case "ticket-priority":
      return "#dc2626";

    case "ticket-assigned":
      return "#6366f1";

    default:
      return "#64748b";
  }
}
