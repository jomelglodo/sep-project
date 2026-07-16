import TimelineItem from "./TimelineItem";

export default function TimelineList({ timeline }) {
  return (
    <>
      {timeline.map((item) => (
        <TimelineItem key={item.timeline_id} item={item} />
      ))}
    </>
  );
}
