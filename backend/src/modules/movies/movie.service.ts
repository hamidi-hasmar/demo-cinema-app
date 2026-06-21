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
  releaseDate: Date;
  isNowShowing?: boolean;
};

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
