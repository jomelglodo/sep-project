import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function UserTicketDashboardChart({ stats }) {
  const data = [
    {
      name: "Open",
      value: stats.open,
    },
    {
      name: "In Progress",
      value: stats.inprogress,
    },
    {
      name: "Closed",
      value: stats.closed,
    },
    {
      name: "Cancelled",
      value: stats.cancelled,
    },
  ];

  const COLORS = [
    "#f59e0b", // Open
    "#8b5cf6", // In progress
    "#10b981", // Closed
    "#ef4444", // Cancelled
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={26}
          fontWeight="bold"
        >
          {stats.total}
        </text>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
          label={({ name, value, percent }) =>
            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
          }
          /* label={({ percent }) => `${(percent * 100).toFixed(0)}%`} */
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} tickets`, name]} />
        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "0.7rem" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
