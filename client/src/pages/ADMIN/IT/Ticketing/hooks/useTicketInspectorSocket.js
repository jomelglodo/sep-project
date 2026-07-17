import { useEffect, useState } from "react";
import socket from "../../../../../services/socket.js";

export default function useTicketInspectorSocket({
  isOpen,
  ticket,
  setTicket,
  setTimeline,
}) {
  useEffect(() => {
    function handleTimelineUpdate(event) {
      if (ticket?.ticket_id !== event.ticket_id) return;

      setTimeline((prev) => [...prev, event]);
    }

    function handleStatusUpdate(data) {
      if (ticket?.ticket_id !== data.ticketId) return;

      setTicket((prev) => ({
        ...prev,
        status: data.status,
      }));
    }

    socket.on("timeline-update", handleTimelineUpdate);
    socket.on("ticket-status-update", handleStatusUpdate);

    return () => {
      socket.off("timeline-update", handleTimelineUpdate);
      socket.off("ticket-status-update", handleStatusUpdate);
    };
  }, [ticket, setTicket, setTimeline]);

  if (!isOpen) return;
}
