import { useState, useCallback } from "react";

const initialModalState = {
  open: false,
  mode: null,
  category: null,
  data: null,
};

export default function useCategoryModal() {
  const [modalState, setModalState] = useState(initialModalState);

  /**
   * Open the modal
   *
   * @param {"add"|"view"|"edit"|"delete"} mode
   * @param {string} category
   * @param {object|null} data
   */

  const openModal = useCallback((mode, category, data = null) => {
    setModalState({
      open: true,
      mode,
      category,
      data,
    });
  }, []);

  //close the modal
  const closeModal = useCallback(() => {
    setModalState(initialModalState);
  });

  //update the selected row while keeping the modal open
  const updateModalData = useCallback((data) => {
    setModalState((prev) => ({
      ...prev,
      data,
    }));
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
    updateModalData,
  };
}
