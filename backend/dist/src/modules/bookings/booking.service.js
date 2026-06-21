"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingTransaction = createBookingTransaction;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
function createReference() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `CB-${timestamp}-${suffix}`;
}
function getCardLastFour(cardNumber) {
    const digits = cardNumber?.replace(/\D/g, "") ?? "";
    return digits.length >= 4 ? digits.slice(-4) : "";
}
async function createBookingTransaction(payload) {
    const showtime = await prisma_1.default.showtime.findUnique({
        where: {
            id: payload.showtimeId,
        },
    });
    if (!showtime) {
        throw new AppError_1.AppError("Showtime not found", 404);
    }
    return prisma_1.default.bookingTransaction.create({
        data: {
            reference: createReference(),
            showtimeId: payload.showtimeId,
            ticketType: payload.ticketType,
            location: payload.location,
            cinemaHall: payload.cinemaHall,
            showDate: payload.showDate,
            startTime: payload.startTime,
            seats: JSON.stringify(payload.seats),
            concessions: JSON.stringify(payload.concessions),
            ticketTotal: payload.ticketTotal,
            concessionTotal: payload.concessionTotal,
            grandTotal: payload.grandTotal,
            paymentMethod: payload.paymentMethod,
            cardLastFour: getCardLastFour(payload.cardNumber),
            status: "PAID",
        },
    });
}
