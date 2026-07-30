import { useState } from "react";
import styles from "../../styles/admin/Ticket_Admin_TicketChart.module.css";
/* import ChartCard from "./ChartCard";
import StatusLegend from "./StatusLegend"; */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  Open: "#f59e0b",
  "In Progress": "#3b82f6",
  Hold: "#8b5cf6",
  Closed: "#22c55e",
  Cancelled: "#ef4444",
};

export default function Ticket_Admin_TicketChart({ data }) {
  const graphData = [
    {
      label: "Total",
      value: data.total,
    },
    {
      label: "Open",
      value: data.open,
    },
    {
      label: "In Progress",
      value: data.inprogress,
    },
    {
      label: "Closed",
      value: data.closed,
    },
    {
      label: "Cancelled",
      value: data.cancelled,
    },
  ];
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={graphData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              activeIndex={activeIndex}
              activeShape={{ outerRadius: 110 }}
              label={({ label, value, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {graphData.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={COLORS[entry.label] ?? "#94a3b8"}
                  fillOpacity={
                    activeIndex === -1 || activeIndex === index ? 1 : 0.3
                  }
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {graphData.map((item) => (
          <button
            type="button"
            key={item.label}
            className={`${styles.item} ${selectedStatus === item.label ? styles.active : ""}`}
          >
            <div className={styles.left}>
              <span
                className={styles.dot}
                style={{
                  backgroundColor: COLORS[item.label] ?? "#94a3b8",
                }}
              />

              <span>{item.label}</span>
            </div>

            <strong>{item.value}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
