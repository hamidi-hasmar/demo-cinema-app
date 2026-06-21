"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middlewares/error.middleware");
const concession_routes_1 = __importDefault(require("./modules/concessions/concession.routes"));
const movie_routes_1 = __importDefault(require("./modules/movies/movie.routes"));
const seat_routes_1 = __importDefault(require("./modules/seats/seat.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/movies", movie_routes_1.default);
app.use("/api/showtimes", seat_routes_1.default);
app.use("/api/concessions", concession_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
