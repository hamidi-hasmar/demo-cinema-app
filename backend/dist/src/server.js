"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const seat_websocket_1 = require("./modules/seats/seat.websocket");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const server = (0, http_1.createServer)(app_1.default);
(0, seat_websocket_1.registerSeatWebSocketServer)(server);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
