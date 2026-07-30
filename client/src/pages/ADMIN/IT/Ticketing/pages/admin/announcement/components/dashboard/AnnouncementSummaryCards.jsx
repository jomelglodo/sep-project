import styles from "./AnnouncementSummaryCards.module.css";

export default function AnnouncementSummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      title: "Total",
      value: summary.total,
    },
    {
      title: "Published",
      value: summary.published,
    },
    {
      title: "Drafts",
      value: summary.drafts,
    },
    {
      title: "Pinned",
      value: summary.pinned,
    },
    {
      title: "Expired",
      value: summary.expired,
    },
    {
      title: "Attachments",
      value: summary.attachments,
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.title} className={styles.card}>
          <span>{card.title}</span>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}
