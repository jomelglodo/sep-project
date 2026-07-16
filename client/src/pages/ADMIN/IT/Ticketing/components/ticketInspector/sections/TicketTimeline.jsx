import styles from "../TicketInspector.module.css";
import { History } from "lucide-react";
import { useTicketInspector } from "../../../context/TicketInspectorContext";
import TimelineList from "../components/TimelineList";

export default function TicketTimeline() {
  const { timeline, loading } = useTicketInspector();

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <History size={18} />
        <h3>Activity Timeline</h3>
      </div>
      {loading ? (
        <div className={styles.timeline_loading}>Loading timeline....</div>
      ) : timeline.length === 0 ? (
        <div className={styles.timeline_empty}>No activity found</div>
      ) : (
        <TimelineList timeline={timeline} />
      )}
    </div>
  );
}
