import styles from "./MonthlyTrendChart.module.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function MonthlyTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="rgba(141, 137, 137, 0.5)"
          vertical={false}
        />
        <XAxis dataKey="month" tick={{ fill: "#cbd5e1", fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fill: "#cbd5e1", fontSize: 13 }} />
        <Tooltip
          cursor={{ fill: "rgba(79,70,229,0.08)" }}
          contentStyle={{
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
          }}
          labelStyle={{
            color: "#ffffff",
            fontWeight: 600,
          }}
        />
        <Bar
          dataKey="total"
          fill="#6366f1"
          radius={[10, 10, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
