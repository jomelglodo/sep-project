import styles from "./Pagination.module.css";

export default function Pagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalPages <= 1) return null;
  function getPageNumbers(currentPage, totalPages) {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className={styles.pagination}>
      <div className={styles.pageSize}>
        <label>Rows per page</label>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ← Previous
      </button>

      <div className={styles.pages}>
        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={item === page ? styles.activePage : styles.pageButton}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
