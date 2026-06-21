import { useCallback, useEffect, useState } from "react";

import { fetchMovies } from "../api/movie-api";
import { Movie } from "../types";

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setMovies(await fetchMovies());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load movies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return {
    movies,
    isLoading,
    error,
    reload: loadMovies,
  };
}
