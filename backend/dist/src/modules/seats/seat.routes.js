"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seat_controller_1 = require("./seat.controller");
const router = (0, express_1.Router)();
router.get("/:showtimeId/seats", seat_controller_1.listSeatLocks);
router.post("/:showtimeId/seats/:seatNumber/lock", seat_controller_1.storeSeatLock);
router.delete("/:showtimeId/seats/:seatNumber/lock", seat_controller_1.destroySeatLock);
exports.default = router;
