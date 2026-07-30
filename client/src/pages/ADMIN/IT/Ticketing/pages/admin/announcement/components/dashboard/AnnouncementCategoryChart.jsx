import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import styles from "./AnnouncementCategoryCharts.module.css";

export default function AnnouncementSummaryChart({ data }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Announcements by Category</h2>
        <p>Distribution of announcements across categories.</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="category"
            tick={{ fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />

          <Tooltip />

          <Bar
            dataKey="total"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
