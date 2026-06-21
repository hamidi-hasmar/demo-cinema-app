"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeBookingTransaction = storeBookingTransaction;
const AppError_1 = require("../../utils/AppError");
const booking_service_1 = require("./booking.service");
function parsePositiveInteger(value, field) {
    const numberValue = Number(value);
    if (!Number.isInteger(numberValue) || numberValue <= 0) {
        throw new AppError_1.AppError(`${field} must be a positive integer`, 400);
    }
    return numberValue;
}
function parseMoney(value, field) {
    const numberValue = Number(value);
    if (!Number.isInteger(numberValue) || numberValue < 0) {
        throw new AppError_1.AppError(`${field} must be a valid amount`, 400);
    }
    return numberValue;
}
function parseRequiredString(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new AppError_1.AppError(`${field} is required`, 400);
    }
    return value.trim();
}
function parseDate(value) {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        throw new AppError_1.AppError("showDate must be a valid date", 400);
    }
    return date;
}
function parseSeats(value) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new AppError_1.AppError("seats is required", 400);
    }
    return value.map((seat) => parseRequiredString(seat, "seat"));
}
function normalizePayload(body) {
    return {
        showtimeId: parsePositiveInteger(body.showtimeId, "showtimeId"),
        ticketType: parseRequiredString(body.ticketType, "ticketType"),
        location: parseRequiredString(body.location, "location"),
        cinemaHall: parseRequiredString(body.cinemaHall, "cinemaHall"),
        showDate: parseDate(body.showDate),
        startTime: parseRequiredString(body.startTime, "startTime"),
        seats: parseSeats(body.seats),
        concessions: Array.isArray(body.concessions) ? body.concessions : [],
        ticketTotal: parseMoney(body.ticketTotal, "ticketTotal"),
        concessionTotal: parseMoney(body.concessionTotal, "concessionTotal"),
        grandTotal: parseMoney(body.grandTotal, "grandTotal"),
        paymentMethod: parseRequiredString(body.paymentMethod, "paymentMethod"),
        cardNumber: typeof body.cardNumber === "string" ? body.cardNumber : undefined,
    };
}
async function storeBookingTransaction(req, res, next) {
    try {
        const transaction = await (0, booking_service_1.createBookingTransaction)(normalizePayload(req.body));
        return res.status(201).json({
            success: true,
            data: transaction,
        });
    }
    catch (error) {
        return next(error);
    }
}
