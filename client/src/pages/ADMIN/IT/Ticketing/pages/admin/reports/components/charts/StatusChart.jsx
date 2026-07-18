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
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={COLORS[entry.label] ?? "#94a3b8"}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <StatusLegend data={data} />
      </div>
    </ChartCard>
  );
}
