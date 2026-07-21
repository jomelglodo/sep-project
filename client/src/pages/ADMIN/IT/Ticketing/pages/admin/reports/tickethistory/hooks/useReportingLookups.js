import { useEffect, useState } from "react";
import { getReportingLookups } from "../../services/reportingService.js";

export default function useReportingLookups() {
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const result = await getReportingLookups();
        setDepartments(result.departments);
        setStaff(result.staff);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { departments, staff, loading };
}
