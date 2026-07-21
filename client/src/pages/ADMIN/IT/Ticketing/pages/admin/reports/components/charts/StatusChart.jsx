import { useState } from "react";
import styles from "./StatusChart.module.css";
import ChartCard from "./ChartCard";
import StatusLegend from "./StatusLegend";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  Open: "#f59e0b",
  "In Progress": "#3b82f6",
  Hold: "#8b5cf6",
  Closed: "#22c55e",
  Cancelled: "#ef4444",
};

export default function StatusChart({ data }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  function handleSelectedStatus(item) {
    const index = data.findIndex((status) => status.label === item.label);

    setSelectedStatus((prev) => (prev === item.label ? null : item.label));

    setActiveIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <ChartCard title="Ticket Status Distribution">
      <div className={styles.container}>
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                activeIndex={activeIndex}
                activeShape={{ outerRadius: 110 }}
                label={({ name, value, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                onMouseEnter={(_, index) => {
                  if (selectedStatus === null) {
                    setActiveIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  if (selectedStatus === null) {
                    setActiveIndex(-1);
                  }
                }}
              >
                {data.map((entry, index) => (
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

        <StatusLegend
          data={data}
          selectedStatus={selectedStatus}
          onSelectedStatus={handleSelectedStatus}
        />
      </div>
    </ChartCard>
  );
}
