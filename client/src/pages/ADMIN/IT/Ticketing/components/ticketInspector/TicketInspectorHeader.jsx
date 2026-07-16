import styles from "./TicketInspector.module.css";

import { useTicketInspector } from "../../context/TicketInspectorContext";

export default function TicketInspectorHeader() {
  const { ticket, loading, closeTicket } = useTicketInspector();

  return (
    <>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2>
            {loading ? "Loading..." : `Ticket #${ticket?.ticket_num ?? ""}`}
          </h2>

          {!loading && <span className={styles.status}>{ticket?.status}</span>}
        </div>

        <button className={styles.close} onClick={closeTicket}>
          ✕
        </button>
      </div>
    </>
  );
}
