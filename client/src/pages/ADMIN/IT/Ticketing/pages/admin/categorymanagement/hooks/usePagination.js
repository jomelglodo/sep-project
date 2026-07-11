import { useMemo, useEffect, useState } from "react";

export default function usePagination(data, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
  };
}
