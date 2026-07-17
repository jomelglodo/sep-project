export function getStatusColor(status) {
  switch (status) {
    case "Open":
      return "#1976d2";

    case "In Progress":
      return "#f57c00";

    case "Closed":
      return "#43a047";

    case "Cancelled":
      return "#757575";

    default:
      return "#616161";
  }
}
