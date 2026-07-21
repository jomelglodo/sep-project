import { useMemo, useState } from "react";
import ChartCard from "./ChartCard";

import styles from "./MonthlyTrendChart.module.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export default function MonthlyTrendChart({ data, onSelectMonth }) {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const chartData = useMemo(() => {
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}`;

    const result = data.map((item) => ({
      ...item,
      isCurrent: item.month === currentMonth,
    }));

    return result;
  }, [data]);

  function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;

    return (
      <div className={styles.tooltip}>
        <strong>{item.label}</strong>
        <div>{item.value} tickets</div>

        {item.isCurrent && <div className={styles.current}>Current Month</div>}
        {selectedMonth?.month === item.month && (
          <div className={styles.selected}>Selected Month</div>
        )}
      </div>
    );
  }

  function handleSelectedMonth(item) {
    const nextSelection = selectedMonth?.month === item.month ? null : item;

    setSelectedMonth(nextSelection);

    onSelectMonth?.(nextSelection);

    console.log(nextSelection);
  }
  return (
    <ChartCard title="Monthly Ticket Trend">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />

          <YAxis allowDecimals={false} />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            onClick={handleSelectedMonth}
            style={{ cursor: "pointer" }}
          >
            {chartData.map((item) => (
              <Cell
                key={item.month}
                fill={
                  selectedMonth?.month === item.month
                    ? "#16a34a"
                    : item.isCurrent
                      ? "#22c55e"
                      : "#3b82f6"
                }
                fillOpacity={
                  selectedMonth === null || selectedMonth.month === item.month
                    ? 1
                    : 0.35
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
