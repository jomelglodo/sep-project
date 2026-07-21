import styles from "./TicketReporting.module.css";

import useReporting from "./hooks/useReporting";

import SummaryCards from "./components/cards/SummaryCards";

import StatusChart from "./components/charts/StatusChart";

import MonthlyTrendChart from "./components/charts/MonthlyTrendChart";

import TicketHistory from "./tickethistory/TicketHistory";

export default function TicketReporting() {
  const { loading, summary, statusChart, monthlyTrend, recentTickets } =
    useReporting();

  /* 
  if (loading) {
    return <ReportingSkeleton />;
  }
 */

  function handleMonthClick() {}
  return (
    <div className={styles.container}>
      <SummaryCards summary={summary} />

      <div className={styles.chart_grid}>
        <StatusChart data={statusChart} />

        <MonthlyTrendChart
          data={monthlyTrend}
          onMonthClick={handleMonthClick}
        />
      </div>
      <TicketHistory />
      {/*  <RecentTicketsTable
                tickets={recentTickets}
            />  */}
    </div>
  );
}
