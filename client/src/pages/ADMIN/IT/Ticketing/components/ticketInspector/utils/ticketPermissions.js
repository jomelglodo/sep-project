export function getAvailableActions(role, ticket) {
  const actions = [];

  if (role === "staff" && ticket.status === "Open") {
    actions.push("start");
  }

  if (role === "staff" && ticket.status === "In Progress") {
    actions.push("close");
    actions.push("update");
  }

  if (role === "admin") {
    actions.push("assign");
    actions.push("priority");
    actions.push("reopen");
  }

  return actions;
}
