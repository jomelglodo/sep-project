import styles from "./HistoryFilters.module.css";
import useReportingLookups from "../hooks/useReportingLookups.js";

export default function HistoryFilters({
  filters,
  updateFilter,
  resetFilters,
}) {
  const TICKET_STATUS = ["Open", "In Progress", "Hold", "Closed", "Cancelled"];

  const { departments, staff, loading } = useReportingLookups();

  return (
    <div className={styles.container}>
      {/* STATUS */}
      <select
        value={filters.status}
        onChange={(e) => {
          updateFilter("status", e.target.value);
        }}
      >
        {TICKET_STATUS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* DEPARTMENT */}
      <select
        value={filters.department}
        onChange={(e) => {
          updateFilter("department", e.target.value);
        }}
      >
        <option value="">All Department</option>
        {departments?.map((dept) => (
          <option key={dept.department} value={dept.department}>
            {dept.department}
          </option>
        ))}
      </select>

      {/* STAFF */}
      <select
        value={filters.staff}
        onChange={(e) => {
          updateFilter("staff", e.target.value);
        }}
      >
        <option value="">All Staff</option>
        {staff?.map((staff) => (
          <option key={staff.user_id} value={staff.staff_name}>
            {staff.staff_name}
          </option>
        ))}
      </select>

      {/* MONTH */}
      <input
        type="month"
        value={filters.month}
        onChange={(e) => {
          updateFilter("month", e.target.value);
        }}
      />
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search ticket..."
        value={filters.search}
        onChange={(e) => {
          updateFilter("search", e.target.value);
        }}
      />

      <button onClick={resetFilters}>Reset</button>
    </div>
  );
}
