import { useMemo } from "react";

export default function useCategoryFilter(data, search, config) {
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    return data.filter((row) =>
      config.searchFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    );
  }, [data, search, config]);

  return filteredData;
}
