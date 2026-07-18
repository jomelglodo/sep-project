import styles from "./SummaryCard.module.css";

export default function SummaryCard({ card }) {
  return (
    <div
      className={styles.card}
      style={{
        borderLeft: `5px solid ${card.color}`,
      }}
    >
      <div className={styles.header}>
        <span className={styles.title}>{card.title}</span>

        {card.icon && (
          <div
            className={styles.icon}
            style={{
              color: card.color,
              backgroundColor: `${card.color}15`,
            }}
          >
            <card.icon size={22} />
          </div>
        )}
      </div>

      <h2 className={styles.value}>{card.value}</h2>

      {card.subtitle && (
        <small className={styles.subtitle}>{card.subtitle}</small>
      )}
    </div>
  );
}
