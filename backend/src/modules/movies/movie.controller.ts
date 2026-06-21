import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import {
  createMovie,
  deleteMovie,
  getMovieById,
  getMovieList,
  MoviePayload,
  updateMovie,
} from "./movie.service";

function parseMovieId(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    throw new AppError("Invalid movie id", 400);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid movie id", 400);
  }

  return id;
}

function normalizeMoviePayload(
  body: Record<string, unknown>,
  isPartial = false,
): Partial<MoviePayload> {
  const payload: Partial<MoviePayload> = {};

  const requiredStringFields = [
    "title",
    "synopsis",
    "language",
    "genre",
    "rating",
    "posterUrl",
  ] as const;

  const optionalStringFields = [
    "trailerUrl",
    "cast",
    "director",
    "writers",
    "ratingBreakdown",
    "reviews",
  ] as const;

  for (const field of requiredStringFields) {
    const value = body[field];

    if (value === undefined) {
      if (!isPartial) {
        throw new AppError(`${field} is required`, 400);
      }
      continue;
    }

    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(`${field} must be a non-empty string`, 400);
    }

    payload[field] = value.trim();
  }

  for (const field of optionalStringFields) {
    const value = body[field];

    if (value === undefined) {
      continue;
    }

    if (typeof value !== "string") {
      throw new AppError(`${field} must be a string`, 400);
    }

    payload[field] = value.trim();
  }

  if (body.durationMinutes !== undefined) {
    const durationMinutes = Number(body.durationMinutes);

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new AppError("durationMinutes must be a positive integer", 400);
    }

    payload.durationMinutes = durationMinutes;
  } else if (!isPartial) {
    throw new AppError("durationMinutes is required", 400);
  }

  if (body.releaseDate !== undefined) {
    const releaseDate = new Date(String(body.releaseDate));

    if (Number.isNaN(releaseDate.getTime())) {
      throw new AppError("releaseDate must be a valid date", 400);
    }

    payload.releaseDate = releaseDate;
  } else if (!isPartial) {
    throw new AppError("releaseDate is required", 400);
  }

  const numberFields = ["averageRating", "reviewCount"] as const;

  for (const field of numberFields) {
    if (body[field] === undefined) {
      continue;
    }

    const value = Number(body[field]);

    if (!Number.isFinite(value) || value < 0) {
      throw new AppError(`${field} must be a positive number`, 400);
    }

    payload[field] = field === "reviewCount" ? Math.floor(value) : value;
  }

  if (body.isNowShowing !== undefined) {
    if (typeof body.isNowShowing !== "boolean") {
      throw new AppError("isNowShowing must be a boolean", 400);
    }

    payload.isNowShowing = body.isNowShowing;
  }

  if (isPartial && Object.keys(payload).length === 0) {
    throw new AppError("At least one movie field is required", 400);
  }

  return payload;
}

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

export async function showMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movie = await getMovieById(parseMovieId(req.params.id));

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    return next(error);
  }
}

export async function storeMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movie = await createMovie(
      normalizeMoviePayload(req.body) as MoviePayload,
    );

    return res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    return next(error);
  }
}

export async function editMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movie = await updateMovie(
      parseMovieId(req.params.id),
      normalizeMoviePayload(req.body, true),
    );

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    return next(error);
  }
}

export async function removeMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await deleteMovie(parseMovieId(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}
