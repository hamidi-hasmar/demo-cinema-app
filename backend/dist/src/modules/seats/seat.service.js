"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatLocks = getSeatLocks;
exports.lockSeat = lockSeat;
exports.releaseSeat = releaseSeat;
exports.addSeatEventClient = addSeatEventClient;
exports.broadcastSeatLocks = broadcastSeatLocks;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const clientsByShowtime = new Map();
function parseSeatNumber(seatNumber) {
    const normalized = seatNumber.trim().toUpperCase();
    if (!/^[A-H][1-8]$/.test(normalized)) {
        throw new AppError_1.AppError("Invalid seat number", 400);
    }
    return normalized;
}
async function ensureShowtime(showtimeId) {
    const showtime = await prisma_1.default.showtime.findUnique({
        where: {
            id: showtimeId,
        },
    });
    if (!showtime) {
        throw new AppError_1.AppError("Showtime not found", 404);
    }
    return showtime;
}
async function getSeatLocks(showtimeId) {
    await ensureShowtime(showtimeId);
    return prisma_1.default.seatLock.findMany({
        where: {
            showtimeId,
        },
        orderBy: {
            seatNumber: "asc",
        },
        select: {
            seatNumber: true,
            lockedBy: true,
            status: true,
            updatedAt: true,
        },
    });
}
async function lockSeat(showtimeId, seatNumber, clientId) {
    await ensureShowtime(showtimeId);
    const normalizedSeatNumber = parseSeatNumber(seatNumber);
    const existingLock = await prisma_1.default.seatLock.findUnique({
        where: {
            showtimeId_seatNumber: {
                showtimeId,
                seatNumber: normalizedSeatNumber,
            },
        },
    });
    if (existingLock && existingLock.lockedBy !== clientId) {
        throw new AppError_1.AppError("Seat is no longer available", 409);
    }
    const seatLock = existingLock
        ? existingLock
        : await prisma_1.default.seatLock.create({
            data: {
                showtimeId,
                seatNumber: normalizedSeatNumber,
                lockedBy: clientId,
            },
        });
    await broadcastSeatLocks(showtimeId);
    return seatLock;
}
async function releaseSeat(showtimeId, seatNumber, clientId) {
    await ensureShowtime(showtimeId);
    const normalizedSeatNumber = parseSeatNumber(seatNumber);
    const existingLock = await prisma_1.default.seatLock.findUnique({
        where: {
            showtimeId_seatNumber: {
                showtimeId,
                seatNumber: normalizedSeatNumber,
            },
        },
    });
    if (!existingLock) {
        return;
    }
    if (existingLock.lockedBy !== clientId) {
        throw new AppError_1.AppError("Seat is locked by another user", 409);
    }
    await prisma_1.default.seatLock.delete({
        where: {
            id: existingLock.id,
        },
    });
    await broadcastSeatLocks(showtimeId);
}
function addSeatEventClient(showtimeId, clientId, send, onClose) {
    const clients = clientsByShowtime.get(showtimeId) ?? [];
    clients.push({
        id: clientId,
        send,
    });
    clientsByShowtime.set(showtimeId, clients);
    onClose(() => {
        const remainingClients = (clientsByShowtime.get(showtimeId) ?? []).filter((client) => client.id !== clientId);
        if (remainingClients.length === 0) {
            clientsByShowtime.delete(showtimeId);
            return;
        }
        clientsByShowtime.set(showtimeId, remainingClients);
    });
}
async function broadcastSeatLocks(showtimeId) {
    const clients = clientsByShowtime.get(showtimeId) ?? [];
    if (clients.length === 0) {
        return;
    }
    const locks = await getSeatLocks(showtimeId);
    const eventPayload = JSON.stringify({
        type: "seat-locks",
        locks,
    });
    for (const client of clients) {
        client.send(eventPayload);
    }
}
