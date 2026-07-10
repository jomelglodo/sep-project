import { useState } from "react";
import { categoryService } from "../services/categoryService";

export default function useCategoryCRUD({ refreshData }) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const createCategory = async (config, body) => {
    setLoading(true);
    setError(null);

    try {
      await categoryService.create(config, body);

      await refreshData();

      return true;
    } catch (err) {
      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (config, id, body) => {
    setLoading(true);
    setError(null);

    try {
      await categoryService.update(config, id, body);

      await refreshData();

      return true;
    } catch (err) {
      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (config, id) => {
    setLoading(true);
    setError(null);

    try {
      await categoryService.delete(config, id);

      await refreshData();

      return true;
    } catch (err) {
      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
