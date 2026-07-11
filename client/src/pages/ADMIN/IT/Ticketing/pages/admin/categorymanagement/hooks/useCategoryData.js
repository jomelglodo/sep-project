import { useCallback, useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";

export default function useCategoryData(configs) {
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const entries = Object.entries(configs);
      const result = await Promise.all(
        entries.map(async ([key, config]) => {
          console.log("Fetching:", key, config.api.getAll.url);
          const data = await categoryService.getAll(config);
          console.log("Received:", key, data);
          return [key, data];
        }),
      );

      setCategoryData(Object.fromEntries(result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //initial fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    categoryData,
    loading,
    error,
    refreshData,
  };
}
