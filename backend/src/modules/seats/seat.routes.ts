import { Router } from "express";
import {
  destroySeatLock,
  listSeatLocks,
  storeSeatLock,
  streamSeatLocks,
} from "./seat.controller";

const router = Router();

router.get("/:showtimeId/seats", listSeatLocks);
router.get("/:showtimeId/seats/events", streamSeatLocks);
router.post("/:showtimeId/seats/:seatNumber/lock", storeSeatLock);
router.delete("/:showtimeId/seats/:seatNumber/lock", destroySeatLock);

export default router;
