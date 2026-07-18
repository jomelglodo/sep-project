import styles from "./TicketReporting.module.css";

import useReporting from "./hooks/useReporting";

import SummaryCards from "./components/cards/SummaryCards";

import StatusChart from "./components/charts/StatusChart";

import MonthlyTrendChart from "./components/charts/MonthlyTrendChart";

import RecentTicketsTable from "./components/tables/RecentTicketsTable";

import ReportingSkeleton from "./components/loading/ReportingSkeleton";

export default function TicketReporting() {
  const { loading, summary, statusChart, monthlyTrend, recentTickets } =
    useReporting();
  /* 
  if (loading) {
    return <ReportingSkeleton />;
  }
 */
  return (
    <div className={styles.container}>
      <SummaryCards summary={summary} />

      <div className={styles.chartGrid}>
        <StatusChart data={statusChart} />

        {/*   <MonthlyTrendChart
                    data={monthlyTrend}
                />
 */}
      </div>

      {/*  <RecentTicketsTable
                tickets={recentTickets}
            />  */}
    </div>
  );
}
