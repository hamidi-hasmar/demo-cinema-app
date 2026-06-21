import { Router } from "express";
import {
  editMovie,
  listMovies,
  removeMovie,
  showMovieBookingOptions,
  showMovie,
  storeMovie,
} from "./movie.controller";

const router = Router();

router.get("/", listMovies);
router.get("/:id/booking-options", showMovieBookingOptions);
router.get("/:id", showMovie);
router.post("/", storeMovie);
router.patch("/:id", editMovie);
router.put("/:id", editMovie);
router.delete("/:id", removeMovie);

export default router;
