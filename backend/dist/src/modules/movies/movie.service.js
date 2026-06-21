"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieList = getMovieList;
exports.getMovieById = getMovieById;
exports.getMovieBookingOptions = getMovieBookingOptions;
exports.createMovie = createMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
function timeToMinutes(value) {
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
            averageRating: true,
            reviewCount: true,
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
async function getMovieBookingOptions(id) {
    await getMovieById(id);
    const showtimes = await prisma_1.default.showtime.findMany({
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
    const ticketRanges = new Map();
    const locations = new Map();
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
                    times: times.sort((current, next) => timeToMinutes(current.startTime) - timeToMinutes(next.startTime)),
                })),
            })),
        })),
    };
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
