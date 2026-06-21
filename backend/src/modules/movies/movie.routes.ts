import { Router } from "express";
import { listMovies } from "./movie.controller";

const router = Router();

router.get("/", listMovies);

export default router;
