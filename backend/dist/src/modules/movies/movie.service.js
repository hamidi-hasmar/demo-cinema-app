"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieList = getMovieList;
exports.getMovieById = getMovieById;
exports.createMovie = createMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
async function getMovieList() {
    return prisma_1.default.movie.findMany({
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
async function getMovieById(id) {
    const movie = await prisma_1.default.movie.findUnique({
        where: {
            id,
        },
    });
    if (!movie) {
        throw new AppError_1.AppError("Movie not found", 404);
    }
    return movie;
}
async function createMovie(payload) {
    return prisma_1.default.movie.create({
        data: payload,
    });
}
async function updateMovie(id, payload) {
    await getMovieById(id);
    return prisma_1.default.movie.update({
        where: {
            id,
        },
        data: payload,
    });
}
async function deleteMovie(id) {
    await getMovieById(id);
    await prisma_1.default.movie.delete({
        where: {
            id,
        },
    });
}
