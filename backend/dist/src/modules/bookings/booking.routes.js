"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const router = (0, express_1.Router)();
router.post("/transactions", booking_controller_1.storeBookingTransaction);
exports.default = router;
