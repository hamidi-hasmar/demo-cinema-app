export type Movie = {
  id: number;
  title: string;
  synopsis: string;
  durationMinutes: number;
  language: string;
  genre: string;
  rating: string;
  posterUrl: string;
  trailerUrl: string;
  cast: string;
  director: string;
  writers: string;
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: string;
  reviews: string;
  releaseDate: string;
  isNowShowing: boolean;
};

export type MovieListResponse = {
  success: boolean;
  data: Movie[];
};

export type MovieResponse = {
  success: boolean;
  data: Movie;
};

export type MovieReview = {
  author: string;
  rating: number;
  title: string;
  comment: string;
};
