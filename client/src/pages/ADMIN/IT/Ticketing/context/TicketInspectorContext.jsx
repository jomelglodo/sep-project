import { createContext, useContext, useEffect, useState } from "react";
import { getTicket } from "../services/ticketInspectorService.js";
import { getTimeline } from "../services/ticketTimelineService.js";
import socket from "../../../../../services/socket.js";

//socket
import useTicketInspectorSocket from "../hooks/useTicketInspectorSocket.js";

const TicketInspectorContext = createContext();

export function TicketInspectorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [ticket, setTicket] = useState(null);

  const [timeline, setTimeline] = useState([]);

  useTicketInspectorSocket({ ticket, setTicket, setTimeline });

  async function openTicket(ticketId) {
    try {
      setLoading(true);
      setIsOpen(true);

      const [ticketData, timelineData] = await Promise.all([
        getTicket(ticketId),
        getTimeline(ticketId),
      ]);

      setTimeline(timelineData);
      setTicket(ticketData);

      //  {#48f,3}
      //join ticket room
      socket.emit("join-ticket", ticketId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function closeTicket() {
    setIsOpen(false);

    setTicket(null);

    if (ticket?.ticket_id) {
      socket.emit("leave-ticket", ticket.ticket_id);
    }
  }

  return (
    <TicketInspectorContext.Provider
      value={{
        isOpen,
        loading,
        ticket,
        timeline,
        openTicket,
        closeTicket,
        setTicket,
        setLoading,
      }}
    >
      {children}
    </TicketInspectorContext.Provider>
  );
}

export function useTicketInspector() {
  return useContext(TicketInspectorContext);
}
