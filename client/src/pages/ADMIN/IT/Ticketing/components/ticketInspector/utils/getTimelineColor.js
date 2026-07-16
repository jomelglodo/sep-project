export function getTimelineColor(type) {
  switch (type) {
    case "ticket-created":
      return "#2563eb";

    case "ticket-starttroubleshoot":
      return "#f59e0b";

    case "ticket-comment":
      return "#7c3aed";

    case "ticket-closed":
      return "#16a34a";

    case "ticket-reopened":
      return "#dc2626";

    case "ticket-assigned":
      return "#0891b2";

    case "ticket-attachment":
      return "#4b5563";

    default:
      return "#6b7280";
  }
}
