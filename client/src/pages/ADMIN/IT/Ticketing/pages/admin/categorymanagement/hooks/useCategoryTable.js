import { useMemo, useState } from "react";

export default function useCategoryTable(data, config) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    return data.filter((row) =>
      config.searchFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    );
  }, [data, search, config.searchFields]);

  return {
    search,
    setSearch,
    filteredData,
  };
}
