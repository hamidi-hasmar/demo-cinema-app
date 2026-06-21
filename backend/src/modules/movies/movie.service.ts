import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export type MoviePayload = {
  title: string;
  synopsis: string;
  durationMinutes: number;
  language: string;
  genre: string;
  rating: string;
  posterUrl: string;
  trailerUrl?: string;
  cast?: string;
  director?: string;
  writers?: string;
  averageRating?: number;
  reviewCount?: number;
  ratingBreakdown?: string;
  reviews?: string;
  releaseDate: Date;
  isNowShowing?: boolean;
};

function timeToMinutes(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [, hourValue, minuteValue, meridiemValue] = match;
  const hour = Number(hourValue) % 12;
  const minute = Number(minuteValue);
  const meridiemOffset = meridiemValue.toUpperCase() === "PM" ? 12 * 60 : 0;

  return hour * 60 + minute + meridiemOffset;
}

export async function getMovieList() {
  return prisma.movie.findMany({
    where: {
      isNowShowing: true,
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      synopsis: true,
      durationMinutes: true,
      language: true,
      genre: true,
      rating: true,
      posterUrl: true,
      averageRating: true,
      reviewCount: true,
      releaseDate: true,
      isNowShowing: true,
    },
  });
}

export async function getMovieById(id: number) {
  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
  });

  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  return movie;
}

export async function getMovieBookingOptions(id: number) {
  await getMovieById(id);

  const showtimes = await prisma.showtime.findMany({
    where: {
      movieId: id,
    },
    orderBy: [
      {
        location: "asc",
      },
      {
        cinemaHall: "asc",
      },
      {
        showDate: "asc",
      },
      {
        startTime: "asc",
      },
    ],
    select: {
      id: true,
      location: true,
      cinemaHall: true,
      showDate: true,
      startTime: true,
      ticketType: true,
      minPrice: true,
      maxPrice: true,
    },
  });

  const ticketRanges = new Map<string, { label: string; minPrice: number; maxPrice: number }>();
  const locations = new Map<
    string,
    Map<string, Map<string, { id: number; startTime: string }[]>>
  >();

  for (const showtime of showtimes) {
    ticketRanges.set(showtime.ticketType, {
      label: showtime.ticketType,
      minPrice: showtime.minPrice,
      maxPrice: showtime.maxPrice,
    });

    const dateKey = showtime.showDate.toISOString().slice(0, 10);
    const halls = locations.get(showtime.location) ?? new Map();
    const dates = halls.get(showtime.cinemaHall) ?? new Map();
    const times = dates.get(dateKey) ?? [];

    times.push({
      id: showtime.id,
      startTime: showtime.startTime,
    });

    dates.set(dateKey, times);
    halls.set(showtime.cinemaHall, dates);
    locations.set(showtime.location, halls);
  }

  return {
    ticketTypes: Array.from(ticketRanges.values()),
    locations: Array.from(locations.entries()).map(([name, halls]) => ({
      name,
      halls: Array.from(halls.entries()).map(([name, dates]) => ({
        name,
        dates: Array.from(dates.entries()).map(([date, times]) => ({
          date,
          times: times.sort(
            (current, next) =>
              timeToMinutes(current.startTime) - timeToMinutes(next.startTime),
          ),
        })),
      })),
    })),
  };
}

export async function createMovie(payload: MoviePayload) {
  return prisma.movie.create({
    data: payload,
  });
}

export async function updateMovie(id: number, payload: Partial<MoviePayload>) {
  await getMovieById(id);

  return prisma.movie.update({
    where: {
      id,
    },
    data: payload,
  });
}

export async function deleteMovie(id: number) {
  await getMovieById(id);

  await prisma.movie.delete({
    where: {
      id,
    },
  });
}
