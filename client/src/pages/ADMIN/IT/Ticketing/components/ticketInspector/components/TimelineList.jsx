import { useEffect, useRef } from "react";
import TimelineItem from "./TimelineItem";
import styles from "../TicketInspector.module.css";

export default function TimelineList({ timeline }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  //EFFECTS

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      shouldAutoScroll.current = distanceFromBottom < 100;
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoScroll.current) return;

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [timeline]);

  return (
    <div className={styles.timeline} ref={containerRef}>
      {timeline.map((item) => (
        <TimelineItem key={item.timeline_id} item={item} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
