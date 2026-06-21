import { useCallback, useEffect, useState } from "react";

import { fetchConcessionItems } from "../api/movie-api";
import { ConcessionItem } from "../types";

export function useConcessionItems() {
  const [items, setItems] = useState<ConcessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setItems(await fetchConcessionItems());
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load food and beverages",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  return {
    items,
    isLoading,
    error,
    reload: loadItems,
  };
}
