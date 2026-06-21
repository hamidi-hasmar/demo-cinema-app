"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSeatLocks = listSeatLocks;
exports.storeSeatLock = storeSeatLock;
exports.destroySeatLock = destroySeatLock;
const AppError_1 = require("../../utils/AppError");
const seat_service_1 = require("./seat.service");
function parseShowtimeId(value) {
    if (typeof value !== "string") {
        throw new AppError_1.AppError("Invalid showtime id", 400);
    }
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError_1.AppError("Invalid showtime id", 400);
    }
    return id;
}
function parseClientId(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new AppError_1.AppError("clientId is required", 400);
    }
    return value.trim();
}
function parseSeatNumberParam(value) {
    if (typeof value !== "string") {
        throw new AppError_1.AppError("Invalid seat number", 400);
    }
    return value;
}
async function listSeatLocks(req, res, next) {
    try {
        const locks = await (0, seat_service_1.getSeatLocks)(parseShowtimeId(req.params.showtimeId));
        return res.status(200).json({
            success: true,
            data: {
                locks,
            },
        });
    }
    catch (error) {
        return next(error);
    }
}
async function storeSeatLock(req, res, next) {
    try {
        const lock = await (0, seat_service_1.lockSeat)(parseShowtimeId(req.params.showtimeId), parseSeatNumberParam(req.params.seatNumber), parseClientId(req.body.clientId));
        return res.status(200).json({
            success: true,
            data: lock,
        });
    }
    catch (error) {
        return next(error);
    }
}
async function destroySeatLock(req, res, next) {
    try {
        await (0, seat_service_1.releaseSeat)(parseShowtimeId(req.params.showtimeId), parseSeatNumberParam(req.params.seatNumber), parseClientId(req.body.clientId));
        return res.status(200).json({
            success: true,
            message: "Seat released successfully",
        });
    }
    catch (error) {
        return next(error);
    }
}
