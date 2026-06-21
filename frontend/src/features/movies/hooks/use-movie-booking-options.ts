import { useCallback, useEffect, useState } from "react";

import { fetchMovieBookingOptions } from "../api/movie-api";
import { MovieBookingOptions } from "../types";

export function useMovieBookingOptions(movieId: number | null) {
  const [bookingOptions, setBookingOptions] = useState<MovieBookingOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookingOptions = useCallback(async () => {
    if (!movieId) {
      setError("Invalid movie");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setBookingOptions(await fetchMovieBookingOptions(movieId));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load booking options",
      );
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadBookingOptions();
  }, [loadBookingOptions]);

  return {
    bookingOptions,
    isLoading,
    error,
    reload: loadBookingOptions,
  };
}
