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

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={styles.backdrop} onClick={closeTicket} />

      <aside className={styles.panel}>
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
