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

export type BookingTime = {
  id: number;
  startTime: string;
};

export type BookingDate = {
  date: string;
  times: BookingTime[];
};

export type BookingHall = {
  name: string;
  dates: BookingDate[];
};

export type BookingLocation = {
  name: string;
  halls: BookingHall[];
};

export type BookingTicketType = {
  label: string;
  minPrice: number;
  maxPrice: number;
};

export type MovieBookingOptions = {
  ticketTypes: BookingTicketType[];
  locations: BookingLocation[];
};

export type MovieBookingOptionsResponse = {
  success: boolean;
  data: MovieBookingOptions;
};

export type SeatLock = {
  seatNumber: string;
  lockedBy: string;
  status: string;
  updatedAt: string;
};

export type SeatLocksResponse = {
  success: boolean;
  data: {
    locks: SeatLock[];
  };
};

export type ConcessionCategory = "food" | "beverage" | "combo";

export type ConcessionItem = {
  id: number;
  name: string;
  description: string;
  category: ConcessionCategory;
  price: number;
};

export type ConcessionItemsResponse = {
  success: boolean;
  data: ConcessionItem[];
};

export type SelectedConcessionItem = ConcessionItem & {
  quantity: number;
};

export type BookingSummaryParams = {
  movieId: string;
  ticketType: string;
  location: string;
  hall: string;
  date: string;
  time: string;
  showtimeId: string;
  seats: string;
  ticketTotal: string;
  concessions?: string;
};
