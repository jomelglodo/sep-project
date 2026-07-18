import { getSummaryReportData } from "../../../../services/ADMIN/IT/Ticketing/reportingService.js";

export async function getSummaryReport(req, res) {
  try {
    const data = await getSummaryReportData();

    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load summary report",
    });
  }
}
