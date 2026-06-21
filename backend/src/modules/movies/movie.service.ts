import prisma from "../../config/prisma";

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
    },
  });
}
