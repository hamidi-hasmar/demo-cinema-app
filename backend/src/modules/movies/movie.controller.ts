import { Request, Response, NextFunction } from "express";
import { getMovieList } from "./movie.service";

export async function listMovies(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movies = await getMovieList();

    return res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    return next(error);
  }
}
