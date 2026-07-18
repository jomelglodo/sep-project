import { useEffect, useState } from "react";
import { getSummaryReport } from "../services/reportingService";

export default function useReporting() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [statusChart, setStatusChart] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      setLoading(true);

      const data = await getSummaryReport();

      setSummary(data.summary);
      setStatusChart(data.statusChart);
      setMonthlyTrend(data.monthlyTrend);
      setRecentTickets(data.recentTickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    summary,
    statusChart,
    monthlyTrend,
    recentTickets,
    reload: loadReport,
  };
}
