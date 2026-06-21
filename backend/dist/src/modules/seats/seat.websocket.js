"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSeatWebSocketServer = registerSeatWebSocketServer;
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = require("../../utils/AppError");
const seat_service_1 = require("./seat.service");
function parseShowtimeId(value) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError_1.AppError("Invalid showtime id", 400);
    }
    return id;
}
function parseClientId(value) {
    if (!value || value.trim().length === 0) {
        throw new AppError_1.AppError("clientId is required", 400);
    }
    return value.trim();
}
function createWebSocketAcceptValue(key) {
    return crypto_1.default
        .createHash("sha1")
        .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
        .digest("base64");
}
function createTextFrame(payload) {
    const payloadBuffer = Buffer.from(payload);
    const length = payloadBuffer.length;
    if (length < 126) {
        return Buffer.concat([Buffer.from([0x81, length]), payloadBuffer]);
    }
    if (length < 65536) {
        const header = Buffer.alloc(4);
        header[0] = 0x81;
        header[1] = 126;
        header.writeUInt16BE(length, 2);
        return Buffer.concat([header, payloadBuffer]);
    }
    const header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
    return Buffer.concat([header, payloadBuffer]);
}
function sendJson(socket, payload) {
    if (!socket.destroyed) {
        socket.write(createTextFrame(payload));
    }
}
function sendCloseFrame(socket) {
    if (!socket.destroyed) {
        socket.end(Buffer.from([0x88, 0x00]));
    }
}
function rejectUpgrade(socket, statusCode, message) {
    socket.write(`HTTP/1.1 ${statusCode} ${message}\r\nConnection: close\r\n\r\n`);
    socket.destroy();
}
function getShowtimeIdFromPath(pathname) {
    const match = pathname.match(/^\/api\/showtimes\/(\d+)\/seats\/ws$/);
    return match ? match[1] : undefined;
}
function registerSeatWebSocketServer(server) {
    server.on("upgrade", async (request, socket) => {
        try {
            const host = request.headers.host ?? "localhost";
            const url = new URL(request.url ?? "", `http://${host}`);
            const showtimeIdValue = getShowtimeIdFromPath(url.pathname);
            if (!showtimeIdValue) {
                rejectUpgrade(socket, 404, "Not Found");
                return;
            }
            const key = request.headers["sec-websocket-key"];
            if (typeof key !== "string") {
                rejectUpgrade(socket, 400, "Bad Request");
                return;
            }
            const showtimeId = parseShowtimeId(showtimeIdValue);
            const clientId = parseClientId(url.searchParams.get("clientId"));
            const locks = await (0, seat_service_1.getSeatLocks)(showtimeId);
            const acceptValue = createWebSocketAcceptValue(key);
            socket.write([
                "HTTP/1.1 101 Switching Protocols",
                "Upgrade: websocket",
                "Connection: Upgrade",
                `Sec-WebSocket-Accept: ${acceptValue}`,
                "\r\n",
            ].join("\r\n"));
            sendJson(socket, JSON.stringify({
                type: "seat-locks",
                locks,
            }));
            (0, seat_service_1.addSeatEventClient)(showtimeId, clientId, (payload) => sendJson(socket, payload), (removeClient) => {
                socket.on("close", removeClient);
                socket.on("end", removeClient);
                socket.on("error", removeClient);
            });
            socket.on("data", (data) => {
                const opcode = Number(data[0] ?? 0) & 0x0f;
                if (opcode === 0x08) {
                    sendCloseFrame(socket);
                }
            });
        }
        catch (error) {
            const statusCode = error instanceof AppError_1.AppError ? error.statusCode : 500;
            const message = statusCode === 500 ? "Internal Server Error" : "Bad Request";
            rejectUpgrade(socket, statusCode, message);
        }
    });
}
