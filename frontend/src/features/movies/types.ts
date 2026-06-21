export type Movie = {
  id: number;
  title: string;
  synopsis: string;
  durationMinutes: number;
  language: string;
  genre: string;
  rating: string;
  posterUrl: string;
  releaseDate: string;
  isNowShowing: boolean;
};

export type MovieListResponse = {
  success: boolean;
  data: Movie[];
};
