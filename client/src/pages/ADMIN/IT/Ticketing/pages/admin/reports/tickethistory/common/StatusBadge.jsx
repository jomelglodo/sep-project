import styles from "./StatusBadge.module.css";

const STATUS_CONFIG = {
  Open: {
    className: styles.open,
  },

  "In Progress": {
    className: styles.inProgress,
  },

  Hold: {
    className: styles.hold,
  },

  Closed: {
    className: styles.closed,
  },

  Cancelled: {
    className: styles.cancelled,
  },
};

const VALID_SIZES = ["small", "medium", "large"];

export default function StatusBadge({ status, size = "medium" }) {
  const config = STATUS_CONFIG[status] ?? {
    className: styles.default,
  };

  const badgeSize = VALID_SIZES.includes(size) ? size : "medium";

  return (
    <span
      className={`
        ${styles.badge}
        ${config.className}
        ${styles[badgeSize]}
      `}
    >
      {status}
    </span>
  );
}
