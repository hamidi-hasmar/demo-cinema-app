"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMovies = listMovies;
const movie_service_1 = require("./movie.service");
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
