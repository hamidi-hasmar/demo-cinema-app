"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("./movie.controller");
const router = (0, express_1.Router)();
router.get("/", movie_controller_1.listMovies);
exports.default = router;
