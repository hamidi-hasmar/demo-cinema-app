import { useCallback, useEffect, useState } from "react";

import { fetchMovie } from "../api/movie-api";
import { Movie } from "../types";

export function useMovie(movieId: number | null) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovie = useCallback(async () => {
    if (!movieId) {
      setError("Invalid movie");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setMovie(await fetchMovie(movieId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load movie");
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  return {
    movie,
    isLoading,
    error,
    reload: loadMovie,
  };
}
