"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const concession_controller_1 = require("./concession.controller");
const router = (0, express_1.Router)();
router.get("/", concession_controller_1.listConcessionItems);
exports.default = router;
