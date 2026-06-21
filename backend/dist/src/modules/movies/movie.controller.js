"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMovies = listMovies;
exports.showMovie = showMovie;
exports.storeMovie = storeMovie;
exports.editMovie = editMovie;
exports.removeMovie = removeMovie;
const AppError_1 = require("../../utils/AppError");
const movie_service_1 = require("./movie.service");
function parseMovieId(value) {
    if (typeof value !== "string") {
        throw new AppError_1.AppError("Invalid movie id", 400);
    }
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError_1.AppError("Invalid movie id", 400);
    }
    return id;
}
function normalizeMoviePayload(body, isPartial = false) {
    const payload = {};
    const stringFields = [
        "title",
        "synopsis",
        "language",
        "genre",
        "rating",
        "posterUrl",
    ];
    for (const field of stringFields) {
        const value = body[field];
        if (value === undefined) {
            if (!isPartial) {
                throw new AppError_1.AppError(`${field} is required`, 400);
            }
            continue;
        }
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new AppError_1.AppError(`${field} must be a non-empty string`, 400);
        }
        payload[field] = value.trim();
    }
    if (body.durationMinutes !== undefined) {
        const durationMinutes = Number(body.durationMinutes);
        if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
            throw new AppError_1.AppError("durationMinutes must be a positive integer", 400);
        }
        payload.durationMinutes = durationMinutes;
    }
    else if (!isPartial) {
        throw new AppError_1.AppError("durationMinutes is required", 400);
    }
    if (body.releaseDate !== undefined) {
        const releaseDate = new Date(String(body.releaseDate));
        if (Number.isNaN(releaseDate.getTime())) {
            throw new AppError_1.AppError("releaseDate must be a valid date", 400);
        }
        payload.releaseDate = releaseDate;
    }
    else if (!isPartial) {
        throw new AppError_1.AppError("releaseDate is required", 400);
    }
    if (body.isNowShowing !== undefined) {
        if (typeof body.isNowShowing !== "boolean") {
            throw new AppError_1.AppError("isNowShowing must be a boolean", 400);
        }
        payload.isNowShowing = body.isNowShowing;
    }
    if (isPartial && Object.keys(payload).length === 0) {
        throw new AppError_1.AppError("At least one movie field is required", 400);
    }
    return payload;
}
async function listMovies(req, res, next) {
    try {
        const movies = await (0, movie_service_1.getMovieList)();
        return res.status(200).json({
            success: true,
            data: movies,
        });
    }
    catch (error) {
        return next(error);
    }
}
async function showMovie(req, res, next) {
    try {
        const movie = await (0, movie_service_1.getMovieById)(parseMovieId(req.params.id));
        return res.status(200).json({
            success: true,
            data: movie,
        });
    }
    catch (error) {
        return next(error);
    }
}
async function storeMovie(req, res, next) {
    try {
        const movie = await (0, movie_service_1.createMovie)(normalizeMoviePayload(req.body));
        return res.status(201).json({
            success: true,
            data: movie,
        });
    }
    catch (error) {
        return next(error);
    }
}
async function editMovie(req, res, next) {
    try {
        const movie = await (0, movie_service_1.updateMovie)(parseMovieId(req.params.id), normalizeMoviePayload(req.body, true));
        return res.status(200).json({
            success: true,
            data: movie,
        });
    }
    catch (error) {
        return next(error);
    }
}
async function removeMovie(req, res, next) {
    try {
        await (0, movie_service_1.deleteMovie)(parseMovieId(req.params.id));
        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
        });
    }
    catch (error) {
        return next(error);
    }
}
