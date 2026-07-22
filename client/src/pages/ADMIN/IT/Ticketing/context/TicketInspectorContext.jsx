import { createContext, useContext, useEffect, useState, useRef } from "react";
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

  const ticketRef = useRef(null);

  useEffect(() => {
    ticketRef.current = ticket;
  }, [ticket]);

  function closeTicket() {
    const ticketId = ticketRef.current?.ticket_id;

    if (ticketId) {
      socket.emit("leave-ticket", ticketId);
    }

    setIsOpen(false);
    setTicket(null);
  }

  /*   function closeTicket() {
    console.log("closeTicket ticket:", ticket);

    if (ticket?.ticket_id) {
      console.log("Leaving room:", ticket.ticket_id);
      socket.emit("leave-ticket", ticket.ticket_id);
    }

    setIsOpen(false);

    setTicket(null);
  }
 */
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
