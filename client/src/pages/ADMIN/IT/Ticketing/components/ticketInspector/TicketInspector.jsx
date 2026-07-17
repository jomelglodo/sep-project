import { useEffect } from "react";
import styles from "./TicketInspector.module.css";

import { useTicketInspector } from "../../context/TicketInspectorContext";
//sections

import TicketInspectorHeader from "./TicketInspectorHeader";
import TicketInformation from "./sections/TicketInformation";
import TicketSubject from "./sections/TicketSubject";
import TicketDescription from "./sections/TicketDescription";
import TicketAttachment from "./sections/TicketAttachment";
import TicketTimeline from "./sections/TicketTimeline";

export default function TicketInspector() {
  const { isOpen, loading, ticket, closeTicket } = useTicketInspector();

  //Prevent page behind the modal to scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        closeTicket();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    /*  document.body.style.overflow = "hidden"; */

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      /*  document.body.style.overflow = ""; */
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.open : ""}`}
        onClick={closeTicket}
      />

      <aside className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
        <TicketInspectorHeader />
        {/* LOADING */}
        {loading ? (
          <div className={styles.loading}>Loading ticket information....</div>
        ) : (
          <>
            {/* Information Section */}
            <TicketInformation ticket={ticket} />

            {/* SUBJECT */}
            <TicketSubject ticket={ticket} />

            {/* DESCRIPTION */}
            <TicketDescription ticket={ticket} />

            {/* ATTACHMENT */}
            <TicketAttachment ticket={ticket} />

            {/* TIMELINE */}

            <TicketTimeline />
          </>
        )}
      </aside>
    </>
  );
}
